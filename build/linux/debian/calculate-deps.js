"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePackageDeps = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const path = require("path");
const manifests = require("../../../cgmanifest.json");
const dep_lists_1 = require("./dep-lists");
function generatePackageDeps(files, arch, chromiumSysroot, vscodeSysroot) {
    const dependencies = files.map(file => calculatePackageDeps(file, arch, chromiumSysroot, vscodeSysroot));
    const additionalDepsSet = new Set(dep_lists_1.additionalDeps);
    dependencies.push(additionalDepsSet);
    return dependencies;
}
exports.generatePackageDeps = generatePackageDeps;
// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/calculate_package_deps.py.
function calculatePackageDeps(binaryPath, arch, chromiumSysroot, vscodeSysroot) {
    try {
        if (!((0, fs_1.statSync)(binaryPath).mode & fs_1.constants.S_IXUSR)) {
            throw new Error(`Binary ${binaryPath} needs to have an executable bit set.`);
        }
    }
    catch (e) {
        // The package might not exist. Don't re-throw the error here.
        console.error('Tried to stat ' + binaryPath + ' but failed.');
    }
    // Get the Chromium dpkg-shlibdeps file.
    const chromiumManifest = manifests.registrations.filter(registration => {
        return registration.component.type === 'git' && registration.component.git.name === 'chromium';
    });
    const dpkgShlibdepsUrl = `https://raw.githubusercontent.com/chromium/chromium/${chromiumManifest[0].version}/third_party/dpkg-shlibdeps/dpkg-shlibdeps.pl`;
    const dpkgShlibdepsScriptLocation = `${(0, os_1.tmpdir)()}/dpkg-shlibdeps.pl`;
    const result = (0, child_process_1.spawnSync)('curl', [dpkgShlibdepsUrl, '-o', dpkgShlibdepsScriptLocation]);
    if (result.status !== 0) {
        throw new Error('Cannot retrieve dpkg-shlibdeps. Stderr:\n' + result.stderr);
    }
    const cmd = [dpkgShlibdepsScriptLocation, '--ignore-weak-undefined'];
    switch (arch) {
        case 'amd64':
            cmd.push(`-l${chromiumSysroot}/usr/lib/x86_64-linux-gnu`, `-l${chromiumSysroot}/lib/x86_64-linux-gnu`, `-l${vscodeSysroot}/usr/lib/x86_64-linux-gnu`, `-l${vscodeSysroot}/lib/x86_64-linux-gnu`);
            break;
        case 'armhf':
            cmd.push(`-l${chromiumSysroot}/usr/lib/arm-linux-gnueabihf`, `-l${chromiumSysroot}/lib/arm-linux-gnueabihf`, `-l${vscodeSysroot}/usr/lib/arm-linux-gnueabihf`, `-l${vscodeSysroot}/lib/arm-linux-gnueabihf`);
            break;
        case 'arm64':
            cmd.push(`-l${chromiumSysroot}/usr/lib/aarch64-linux-gnu`, `-l${chromiumSysroot}/lib/aarch64-linux-gnu`, `-l${vscodeSysroot}/usr/lib/aarch64-linux-gnu`, `-l${vscodeSysroot}/lib/aarch64-linux-gnu`);
            break;
    }
    cmd.push(`-l${chromiumSysroot}/usr/lib`);
    cmd.push(`-L${vscodeSysroot}/debian/libxkbfile1/DEBIAN/shlibs`);
    cmd.push('-O', '-e', path.resolve(binaryPath));
    const dpkgShlibdepsResult = (0, child_process_1.spawnSync)('perl', cmd, { cwd: chromiumSysroot });
    if (dpkgShlibdepsResult.status !== 0) {
        throw new Error(`dpkg-shlibdeps failed with exit code ${dpkgShlibdepsResult.status}. stderr:\n${dpkgShlibdepsResult.stderr} `);
    }
    const shlibsDependsPrefix = 'shlibs:Depends=';
    const requiresList = dpkgShlibdepsResult.stdout.toString('utf-8').trimEnd().split('\n');
    let depsStr = '';
    for (const line of requiresList) {
        if (line.startsWith(shlibsDependsPrefix)) {
            depsStr = line.substring(shlibsDependsPrefix.length);
        }
    }
    // Refs https://chromium-review.googlesource.com/c/chromium/src/+/3572926
    // Chromium depends on libgcc_s, is from the package libgcc1.  However, in
    // Bullseye, the package was renamed to libgcc-s1.  To avoid adding a dep
    // on the newer package, this hack skips the dep.  This is safe because
    // libgcc-s1 is a dependency of libc6.  This hack can be removed once
    // support for Debian Buster and Ubuntu Bionic are dropped.
    //
    // Remove kerberos native module related dependencies as the versions
    // computed from sysroot will not satisfy the minimum supported distros
    // Refs https://github.com/microsoft/vscode/issues/188881.
    // TODO(deepak1556): remove this workaround in favor of computing the
    // versions from build container for native modules.
    const filteredDeps = depsStr.split(', ').filter(dependency => {
        return !dependency.startsWith('libgcc-s1');
    }).sort();
    const requires = new Set(filteredDeps);
    return requires;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRlLWRlcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYWxjdWxhdGUtZGVwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztnR0FHZ0c7OztBQUVoRyxpREFBMEM7QUFDMUMsMkJBQXlDO0FBQ3pDLDJCQUE0QjtBQUM1Qiw2QkFBOEI7QUFDOUIsc0RBQXNEO0FBQ3RELDJDQUE2QztBQUc3QyxTQUFnQixtQkFBbUIsQ0FBQyxLQUFlLEVBQUUsSUFBc0IsRUFBRSxlQUF1QixFQUFFLGFBQXFCO0lBQzFILE1BQU0sWUFBWSxHQUFrQixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUN4SCxNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLDBCQUFjLENBQUMsQ0FBQztJQUNsRCxZQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckMsT0FBTyxZQUFZLENBQUM7QUFDckIsQ0FBQztBQUxELGtEQUtDO0FBRUQsNkhBQTZIO0FBQzdILFNBQVMsb0JBQW9CLENBQUMsVUFBa0IsRUFBRSxJQUFzQixFQUFFLGVBQXVCLEVBQUUsYUFBcUI7SUFDdkgsSUFBSSxDQUFDO1FBQ0osSUFBSSxDQUFDLENBQUMsSUFBQSxhQUFRLEVBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxHQUFHLGNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxVQUFVLHVDQUF1QyxDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNGLENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1osOERBQThEO1FBQzlELE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxHQUFHLGNBQWMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFF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