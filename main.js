const { Plugin } = require('obsidian');

module.exports = class FileTreeFolderNotePlugin extends Plugin {
  async onload() {
    console.log('%c[Folder Note Visualizer]%c Initializing Style Override Engine...', 'color: #eccc68; font-weight: bold;', 'color: default;');

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
      /* 1. COMPLETELY STRIP THE THEME UNDERLINE RULES */
      .folder-note-underline .has-folder-note .nav-folder-title-content,
      .has-folder-note .nav-folder-title-content,
      .has-folder-note .tree-item-inner {
        text-decoration: none !important;
        text-decoration-line: none !important;
        text-decoration-property: none !important;
      }

      /* 2. ESTABLISH TRACKING BOUNDARIES ON THE TITLE CONTENT WRAPPER */
      .has-folder-note .nav-folder-title-content,
      .has-folder-note .tree-item-inner {
        position: relative !important;
        /* Generate soft left clearance room so our absolute dot floats beautifully */
        padding-left: 1.25em !important; 
        transition: color 0.2s ease-in-out !important;
      }

      /* 3. INJECT THE COLORED DOT INDICATOR AS A PSEUDO-ELEMENT CHILD */
      .has-folder-note .nav-folder-title-content::before,
      .has-folder-note .tree-item-inner::before {
        content: '' !important;
        position: absolute !important;
        left: 0.15em !important; /* Positions the dot cleanly left of the text characters */
        top: 50% !important;
        transform: translateY(-50%) !important; /* Centers dot perfectly vertically on the text line */
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        
        /* Using currentColor makes the dot automatically track alpha-hue color parameters */
        background-color: currentColor !important; 
        
        pointer-events: none !important; /* Prevents the overlay from blocking mouse row selection clicks */
        opacity: 1 !important;
        transition: transform 0.2s ease-in-out !important;
      }

      /* 4. HOVER INTERACTION: Smoothly scales up when hovering over the folder title container */
      .tree-item-self.has-folder-note:hover .nav-folder-title-content::before,
      .tree-item-self.has-folder-note:hover .tree-item-inner::before {
        transform: translateY(-50%) scale(1.3) !important;
      }
    `;

    document.head.appendChild(styleEl);
    console.log('[Folder Note Visualizer] Global CSS override layouts successfully registered.');
  }
};
