const { Plugin } = require('obsidian');

module.exports = class FileTreeFolderNotePlugin extends Plugin {
  async onload() {
    console.log('%c[Folder Note Visualizer]%c Initializing Outer Container Engine...', 'color: #eccc68; font-weight: bold;', 'color: default;');

    // Inject the required custom layout and pseudo-element style layers into the DOM head
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

    styleEl.innerHTML = `
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

      /* 3. INJECT THE COLORED DOT OVERLAY AS A CHILD OF THE OUTER CONTAINER ELEMENT */
      .tree-item-self.has-folder-note::before {
        content: '' !important;
        position: absolute !important;
        
        /* Positions the dot perfectly inside the left margin gutter zone */
        left: 10px !important; 
        top: 50% !important;
        transform: translateY(-50%) !important; /* Centers dot perfectly vertically on the row line */
        
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        
        /* Dynamically mirrors whatever alphabetical spectrum hue your text folder is displaying */
        background-color: currentColor !important; 
        
        /* Explicitly prevents the overlay from blocking mouse row selection clicks */
        pointer-events: none !important; 
        
        opacity: 1 !important;
        z-index: 20 !important;
        transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease !important;
      }

      /* 4. HOVER INTERACTION: Lightens or scales the dot indicator smoothly on mouseover of the nav-folder row */
      .tree-item-self.has-folder-note:hover::before {
        transform: translateY(-50%) scale(1.4) !important;
      }
    `;

    document.head.appendChild(styleEl);
    console.log('[Folder Note Visualizer] Global container-level pseudo indicators successfully registered.');
  }
};
