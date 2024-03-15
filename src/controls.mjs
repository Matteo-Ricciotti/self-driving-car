class Controls {
  forward = false;
  left = false;
  right = false;
  reverse = false;

  /**
   * @param {'KEYS' | 'DUMMY' | 'AI'} controlType
   */
  constructor(controlType) {
    switch (controlType) {
      case 'KEYS':
        this.#addKeyboardListeners();
        break;

      case 'DUMMY':
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners = () => {
    document.onkeydown = (ev) => {
      switch (ev.key) {
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'w':
          this.forward = true;
          break;
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'a':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'd':
          this.right = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
        case 's':
          this.reverse = true;
          break;
      }
    };

    document.onkeyup = (ev) => {
      switch (ev.key) {
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'w':
          this.forward = false;
          break;
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'a':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'd':
          this.right = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
        case 's':
          this.reverse = false;
          break;
      }
    };
  };
}

export default Controls;
