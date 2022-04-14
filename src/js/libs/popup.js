// Module of popups
// Snippet (HTML): pl

// Connecting functionality
import { isMobile, bodyLockStatus, bodyLock, bodyUnlock, bodyLockToggle, FLS } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

// Popup class
class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            // For buttons
            attributeOpenButton: 'data-popup', // Attribute for button, which call / open popup
            attributeCloseButton: 'data-close', // Attribute for button, which will close popup
            // For third party objects
            fixElementSelector: '[data-lp]', // Attribute for elements with left padding (which are fixed)
            // For popup objects
            youtubeAttribute: 'data-popup-youtube', // Attribute for youtube code
            youtubePlaceAttribute: 'data-popup-youtube-place', // Attribute for placing youtube
            setAutoplayYoutube: true,
            // Changins classes
            classes: {
                popup: 'popup',
                // popupWrapper: 'popup__wrapper',
                popupContent: 'popup__content',
                popupActive: 'popup_show', // Adds for popup, when he opens
                bodyActive: 'popup-show', // Adds for body, when popup is opened
            },
            focusCatch: true, // Focus inside popup
            closeEsc: true, // Close by ESC click
            bodyLock: true, // Scroll blocking
            hashSettings: {
                location: true, // Hash in address bar
                goHash: true, // Jump by presence in the address bar
            },
            on: { // Events
                beforeOpen: function () { },
                afterOpen: function () { },
                beforeClose: function () { },
                afterClose: function () { },
            },
        }
        this.youTubeCode;
        this.isOpen = false;
        // Current window
        this.targetOpen = {
            selector: false,
            element: false,
        }
        // Previous opened
        this.previousOpen = {
            selector: false,
            element: false,
        }
        // Last closed
        this.lastClosed = {
            selector: false,
            element: false,
        }
        this._dataValue = false;
        this.hash = false;

        this._reopen = false;
        this._selectorOpen = false;

        this.lastFocusEl = false;
        this._focusEl = [
            'a[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'area[href]',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];
        //this.options = Object.assign(config, options);
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes,
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings,
            },
            on: {
                ...config.on,
                ...options?.on,
            }
        }
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null
    }

    initPopups() {
        this.popupLogging(`Wakeup`);
        this.eventsPopup();
    }

    eventsPopup() {
        // Click on whole document
        document.addEventListener("click", function (e) {
            // Click on "open" button
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ?
                    buttonOpen.getAttribute(this.options.attributeOpenButton) :
                    'error';
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ?
                    buttonOpen.getAttribute(this.options.youtubeAttribute) :
                    null;
                if (this._dataValue !== 'error') {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;

                } else this.popupLogging(`Warning, attribute not filled in ${buttonOpen.classList}`);

                return;
            }
            // Clossing on empty space (popup__wrapper) and click on close button (popup__close) for closing
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        // Clossing by pressing ESC
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this))

        // Opening by hash (#)
        if (this.options.hashSettings.goHash) {
            // Check change in browser command line (path / url)
            window.addEventListener('hashchange', function () {
                if (window.location.hash) {
                    this._openToHash();
                } else {
                    this.close(this.targetOpen.selector);
                }
            }.bind(this))

            window.addEventListener('load', function () {
                if (window.location.hash) {
                    this._openToHash();
                }
            }.bind(this))
        }
    }

    open(selectorValue) {
        if (bodyLockStatus) {
            // If before opening popup was "lock" mode
            this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false;

            // If enter value of selector (selector can be set in options)
            if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;

            this.targetOpen.element = document.querySelector(this.targetOpen.selector);

            if (this.targetOpen.element) {
                // YouTube
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('allowfullscreen', '');

                    const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
                    iframe.setAttribute('allow', `${autoplay}; encrypted-media`);

                    iframe.setAttribute('src', urlVideo);

                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        const youtubePlace = this.targetOpen.element.querySelector('.popup__text').setAttribute(`${this.options.youtubePlaceAttribute}`, '');
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                if (this.options.hashSettings.location) {
                    // Getting and setting hash (#)
                    this._getHash();
                    this._setHash();
                }

                // Before open
                this.options.on.beforeOpen(this);
                // Create custom event after popup opening
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));

                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);

                if (!this._reopen) {
                    !this.bodyLock ? bodyLock() : null;
                }
                else this._reopen = false;

                this.targetOpen.element.setAttribute('aria-hidden', 'false');

                // Remembers that window is opening. It will last opened
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;

                this._selectorOpen = false;

                this.isOpen = true;

                setTimeout(() => {
                    this._focusTrap();
                }, 50);

                // After opening
                this.options.on.afterOpen(this);
                // Create custome event after opening popup
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.popupLogging(`Popup opened`);

            } else this.popupLogging(`Warning! That popup don't exist. Check validity of input`);
        }
    }

    close(selectorValue) {
        if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
            this.previousOpen.selector = selectorValue;
        }
        if (!this.isOpen || !bodyLockStatus) {
            return;
        }
        // Before closing
        this.options.on.beforeClose(this);
        // Create custom event before closing popup
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));

        // YouTube
        if (this.youTubeCode) {
            if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`))
                this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = '';
        }
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        // aria-hidden
        this.previousOpen.element.setAttribute('aria-hidden', 'true');
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        // Clear address / command line
        this._removeHash();
        if (this._selectorOpen) {
            this.lastClosed.selector = this.previousOpen.selector;
            this.lastClosed.element = this.previousOpen.element;

        }
        // After closing
        this.options.on.afterClose(this);
        // Create custom event after popup closing
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));

        setTimeout(() => {
            this._focusTrap();
        }, 50);

        this.popupLogging(`Popup closed`);
    }

    // Getting hash (#)
    _getHash() {
        if (this.options.hashSettings.location) {
            this.hash = this.targetOpen.selector.includes('#') ?
                this.targetOpen.selector : this.targetOpen.selector.replace('.', '#')
        }
    }

    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace('#', '')}`) ? `.${window.location.hash.replace('#', '')}` :
            document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` :
                null;

        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace('.', "#")}"]`);
        if (buttons && classInHash) this.open(classInHash);
    }

    // Setting hash (#)
    _setHash() {
        history.pushState('', '', this.hash);
    }

    _removeHash() {
        history.pushState('', '', window.location.href.split('#')[0])
    }

    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }

    _focusTrap() {
        const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
        if (!this.isOpen && this.lastFocusEl) {
            this.lastFocusEl.focus();
        } else {
            focusable[0].focus();
        }
    }

    // Function logging in console
    popupLogging(message) {
        this.options.logging ? FLS(`[Popup]: ${message}`) : null;
    }
}
// Start and add in modules
flsModules.popup = new Popup({});