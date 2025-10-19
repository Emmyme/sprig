# Sprig Build Directory

This directory contains build files and assets for the Sprig desktop application.

## Structure

* **bin** - Output directory where compiled applications are placed
* **darwin** - macOS specific build files and configurations
* **windows** - Windows specific build files and configurations

## macOS Build Files (darwin)

The `darwin` directory contains files specific to macOS builds. These can be customized for Sprig branding and functionality.

### Files:
- `Info.plist` - Main property list file for production builds (`wails build`)
- `Info.dev.plist` - Property list file for development builds (`wails dev`)

These files control:
- Application name and bundle identifier
- Sprig version information
- macOS permissions and capabilities
- App icon and display settings

## Windows Build Files

The `windows` directory contains Windows-specific build configurations and assets.

### Files:
- `icon.ico` - Sprig application icon for Windows
- `info.json` - Application metadata (name, version, description, copyright)
- `wails.exe.manifest` - Windows application manifest
- `installer/` - Windows installer configuration files

### Customization:
- Replace `icon.ico` with custom Sprig branding icon
- Update `info.json` with Sprig application details
- Modify installer files for custom installation experience

### Auto-Generation:
If build files are missing, Wails will regenerate them with default settings when running `wails build`. To restore defaults, simply delete the files and rebuild.

## Building Sprig

```bash
# Development build with hot reload
wails dev

# Production build
wails build

# Build for specific platform
wails build -platform darwin/amd64
wails build -platform windows/amd64
```

The compiled Sprig application will be placed in the `bin` directory.