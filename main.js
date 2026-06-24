const { Plugin } = require('obsidian');

module.exports = class FileTreeFolderNotePlugin extends Plugin {
  async onload() {
    console.log('%c[Folder Note Visualizer]%c Initializing Depth-Synced Container Engine...', 'color: #eccc68; font-weight: bold;', 'color: default;');

    // Inject the style sheet rules layer containing explicit depth color overrides
    this.injectStyles();
  }

  onunload() {
    console.log('%c[Folder Note Visualizer]%c Stripping custom style layers...', 'color: #eccc68; font-weight: bold;', 'color: default;');
    const styleEl = document.getElementById('obsidian-file-tree-folder-note');
    if (styleEl) styleEl.remove();
  }

  injectStyles() {
    if (document.getElementById('obsidian-file-tree-folder-note')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'obsidian-file-tree-folder-note';

    // Core 6-Step color mapping system matched to your File Tree Depth plugin configurations
    const depthColorsMap = {
      "0": { rest: "hsl(0, 75%, 35%)",   hover: "hsl(0, 75%, 45%)" },    // Level 0: Red
      "1": { rest: "hsl(280, 70%, 35%)", hover: "hsl(280, 70%, 45%)" },  // Level 1: Purple
      "2": { rest: "hsl(210, 75%, 35%)", hover: "hsl(210, 75%, 45%)" },  // Level 2: Blue
      "3": { rest: "hsl(120, 65%, 30%)", hover: "hsl(120, 65%, 40%)" },  // Level 3: Green
      "4": { rest: "hsl(50, 80%, 30%)",  hover: "hsl(50, 80%, 40%)" },   // Level 4: Yellow
      "5": { rest: "hsl(25, 80%, 35%)",  hover: "hsl(25, 80%, 45%)" }    // Level 5: Orange
    };

    let cssRules = `
      /* 1. COMPLETELY STRIP THE DEFAULT THEME UNDERLINE RULES */
      .folder-note-underline .has-folder-note .nav-folder-title-content,
      .has-folder-note .nav-folder-title-content,
      .has-folder-note .tree-item-inner {
        text-decoration: none !important;
        text-decoration-line: none !important;
        text-decoration-property: none !important;
      }

      /* 2. ESTABLISH AN ABSOLUTE STACKING BOUNDARY ON THE TREE ITEM SELF CONTAINER ROW */
      .tree-item-self.has-folder-note {
        position: relative !important;
      }

      /* 3. INJECT THE FLOATING DOT CORE STRUCTURE */
      .tree-item-self.has-folder-note::before {
        content: '' !important;
        position: absolute !important;
        left: 10px !important; 
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        pointer-events: none !important; 
        opacity: 1 !important;
        z-index: 20 !important;
        transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.25s ease !important;
      }

      /* HOVER BOUNCE ACTION: Scales the absolute dot up smoothly on row mouseover */
      .tree-item-self.has-folder-note:hover::before {
        transform: translateY(-50%) scale(1.4) !important;
      }
    `;

    // 4. MAP THE SPECIFIC DEPTH COLORS AND EXTEND HOVER ILLUMINATION CONTROLS
    Object.keys(depthColorsMap).forEach((depthKey) => {
      const colors = depthColorsMap[depthKey];

      cssRules += `
        /* Resting State Color Assignment: Intercepts parent data-nav-depth attributes */
        .tree-item.nav-folder[data-nav-depth="${depthKey}"] .tree-item-self.has-folder-note::before,
        .tree-item.nav-folder[data-nav-depth$="${parseInt(depthKey) + 6}"] .tree-item-self.has-folder-note::before,
        .tree-item.nav-folder[data-nav-depth$="${parseInt(depthKey) + 12}"] .tree-item-self.has-folder-note::before {
          background-color: ${colors.rest} !important;
        }

        /* Hover State Color Assignment: Illuminates indicator dots back up to full brightness profiles */
        .tree-item.nav-folder[data-nav-depth="${depthKey}"] .tree-item-self.has-folder-note:hover::before,
        .tree-item.nav-folder[data-nav-depth$="${parseInt(depthKey) + 6}"] .tree-item-self.has-folder-note:hover::before,
        .tree-item.nav-folder[data-nav-depth$="${parseInt(depthKey) + 12}"] .tree-item-self.has-folder-note:hover::before {
          background-color: ${colors.hover} !important;
        }
      `;
    });

    styleEl.innerHTML = cssRules;
    document.head.appendChild(styleEl);
    console.log('[Folder Note Visualizer] Depth-synced container-level indicators successfully registered.');
  }
};
