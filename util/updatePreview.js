const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(__dirname, 'config.json');
const readmePath = path.join(rootDir, 'README.md');
const chromePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const targetUrl = process.env.PREVIEW_URL || 'http://localhost:3000/ilib/localeSpecDoc/reference';
const windowSize = process.env.PREVIEW_WINDOW_SIZE || '1766,1022';

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
        console.error(`Chrome executable was not found: ${filePath}`);
        process.exit(1);
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

function capturePreview() {
    ensureChromeExists(chromePath);
    backupExistingPreview(outputFile);

    const result = spawnSync(
        chromePath,
        [
            '--headless',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            `--window-size=${windowSize}`,
            '--virtual-time-budget=10000',
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

capturePreview();