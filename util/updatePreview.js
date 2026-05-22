const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const {spawnSync} = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(__dirname, 'config.json');
const readmePath = path.join(rootDir, 'README.md');
const indexJsPath = path.join(rootDir, 'src', 'index.js');
const chromePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const previewHost = process.env.PREVIEW_HOST || 'http://localhost:3000';
const windowSize = process.env.PREVIEW_WINDOW_SIZE || '1766,1022';
const virtualTimeBudget = process.env.PREVIEW_VIRTUAL_TIME_BUDGET || '30000';
const previewRequestTimeout = Number.parseInt(process.env.PREVIEW_REQUEST_TIMEOUT || '5000', 10);

function normalizeBasePath(basePath) {
    if (!basePath || basePath === '/') {
        return '/';
    }

    const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
    return withLeadingSlash.endsWith('/')
        ? withLeadingSlash.slice(0, withLeadingSlash.length - 1)
        : withLeadingSlash;
}

function detectBasePathFromIndexJs() {
    if (!fs.existsSync(indexJsPath)) {
        return '/';
    }

    const indexJs = fs.readFileSync(indexJsPath, 'utf-8');
    const basenameMatch = indexJs.match(/basename\s*=\s*["']([^"']+)["']/);

    if (!basenameMatch) {
        return '/';
    }

    return normalizeBasePath(basenameMatch[1]);
}

const defaultPreviewUrl = `${previewHost}${detectBasePathFromIndexJs()}`;
const targetUrl = process.env.PREVIEW_URL || defaultPreviewUrl;

function printHelp() {
    console.error('');
    console.error('updatePreview help');
    console.error('  1) Start dev server: npm start');
    console.error('  2) Run capture:     npm run updatePreview');
    console.error('');
    console.error('Useful options (env):');
    console.error('  PREVIEW_URL=http://localhost:3000/ilib-localespec-doc');
    console.error('  PREVIEW_HOST=http://localhost:3000');
    console.error('  PREVIEW_WINDOW_SIZE=1766,1022');
    console.error('  PREVIEW_VIRTUAL_TIME_BUDGET=30000');
    console.error('  PREVIEW_REQUEST_TIMEOUT=5000');
}

function failWithHelp(message, reason) {
    console.error(message);
    if (reason) {
        console.error(`Reason: ${reason}`);
    }
    printHelp();
    process.exit(1);
}

function checkPreviewUrlReachable(urlString, timeoutMs) {
    return new Promise((resolve, reject) => {
        let parsedUrl;
        try {
            parsedUrl = new URL(urlString);
        } catch (error) {
            reject(new Error(`Invalid PREVIEW_URL: ${urlString}`));
            return;
        }

        const requester = parsedUrl.protocol === 'https:' ? https : http;

        const request = requester.request(
            parsedUrl,
            {
                method: 'GET',
                timeout: timeoutMs,
                headers: {
                    'User-Agent': 'updatePreview-preflight',
                },
            },
            response => {
                response.resume();
                if (response.statusCode && response.statusCode >= 200 && response.statusCode < 500) {
                    resolve();
                    return;
                }

                reject(new Error(`Preview URL returned unexpected status: ${response.statusCode || 'unknown'}`));
            }
        );

        request.on('timeout', () => {
            request.destroy(new Error(`Timed out after ${timeoutMs}ms`));
        });

        request.on('error', error => {
            reject(error);
        });

        request.end();
    });
}

async function ensurePreviewServerReady(urlString) {
    try {
        await checkPreviewUrlReachable(urlString, previewRequestTimeout);
    } catch (error) {
        failWithHelp(`Could not reach preview URL: ${urlString}`, error.message);
    }
}

function getOutputFile() {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const ilibVersion = config?.packages?.ilibVersion;

    if (!ilibVersion) {
        console.error(`ilibVersion was not found in ${path.relative(rootDir, configPath)}`);
        process.exit(1);
    }

    const version = ilibVersion.includes('@') ? ilibVersion.split('@').pop() : ilibVersion;
    const safeVersion = version.replace(/\./g, '_').replace(/[^A-Za-z0-9_-]/g, '_');

    return path.join(rootDir, 'images', `localeSpecDoc_Snapshot_v${safeVersion}.png`);
}

const outputFile = getOutputFile();

function formatTimestamp(date) {
    return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\..+/, '')
        .replace('T', '_');
}

function getBackupTimestamp(filePath) {
    const stats = fs.statSync(filePath);
    const birthTime = stats.birthtime;
    const modifiedTime = stats.mtime;

    if (birthTime instanceof Date && !Number.isNaN(birthTime.getTime()) && birthTime.getTime() > 0) {
        return birthTime;
    }

    return modifiedTime;
}

function ensureChromeExists(filePath) {
    if (!fs.existsSync(filePath)) {
        failWithHelp(`Chrome executable was not found: ${filePath}`);
    }
}

function backupExistingPreview(filePath) {
    if (!fs.existsSync(filePath)) return;

    const timestamp = formatTimestamp(getBackupTimestamp(filePath));
    const backupFile = filePath.replace(/\.png$/, `_${timestamp}.png`);
    fs.copyFileSync(filePath, backupFile);
    console.log(`Backed up existing preview to ${path.relative(rootDir, backupFile)}`);
}

function updateReadmePreviewImage(filePath) {
    if (!fs.existsSync(readmePath)) {
        console.error(`README file was not found: ${path.relative(rootDir, readmePath)}`);
        process.exit(1);
    }

    const relativeImagePath = `./${path.relative(rootDir, filePath).replace(/\\/g, '/')}`;
    const readmeText = fs.readFileSync(readmePath, 'utf-8');
    const previewTagPattern = /<img\s+src="\.\/images\/localeSpecDoc_[^"]+\.png"\s+width="900"\s+height="600"\s*\/?>/;
    const replacementTag = `<img src="${relativeImagePath}" width="900" height="600"/>`;

    if (!previewTagPattern.test(readmeText)) {
        console.error('Could not find the Preview image tag in README.md.');
        process.exit(1);
    }

    const updatedReadme = readmeText.replace(previewTagPattern, replacementTag);

    if (updatedReadme !== readmeText) {
        fs.writeFileSync(readmePath, updatedReadme);
        console.log(`Updated README preview image to ${relativeImagePath}`);
    }
}

async function capturePreview() {
    ensureChromeExists(chromePath);
    await ensurePreviewServerReady(targetUrl);
    backupExistingPreview(outputFile);
    fs.mkdirSync(path.dirname(outputFile), {recursive: true});

    console.log(`Capturing preview from ${targetUrl}`);

    const result = spawnSync(
        chromePath,
        [
            '--headless',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            `--window-size=${windowSize}`,
            `--virtual-time-budget=${virtualTimeBudget}`,
            '--run-all-compositor-stages-before-draw',
            `--screenshot=${outputFile}`,
            targetUrl,
        ],
        {
            cwd: rootDir,
            encoding: 'utf-8',
            stdio: 'inherit',
        }
    );

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }

    updateReadmePreviewImage(outputFile);
    console.log(`Updated preview screenshot: ${path.relative(rootDir, outputFile)}`);
}

capturePreview().catch(error => {
    failWithHelp('Failed to capture preview.', error.message);
});