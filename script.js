class MultiTapEmulator {
    constructor() {
        this.keyMapping = {
            '2': 'abc2',
            '3': 'def3',
            '4': 'ghi4',
            '5': 'jkl5',
            '6': 'mno6',
            '7': 'pqrs7',
            '8': 'tuv8',
            '9': 'wxyz9'
        };

        this.currentText = '';
        this.currentKey = null;
        this.currentKeyIndex = 0;
        this.currentLetter = '';
        this.lastKeyTime = 0;
        this.keyTimeout = null;
        this.timeoutDuration = 1000; // 1 second timeout between key presses
        this.numberMode = false;
        this.shiftMode = false; // Single letter capitalization
        this.capsLockMode = false; // All letters capitalized
        this.lastHashTime = 0; // For detecting double # press
        this.longPressTimer = null; // For long press detection
        this.longPressDuration = 800; // 800ms for long press
        this.messageTimeout = null; // For message timeout
        this.keyboardLongPressTimer = null; // For keyboard long press detection
        this.isTypingActive = false; // Track if typing indicator is active
        this.inactivityTimer = null; // For inactivity messages
        this.lastActivityTime = Date.now(); // Track last user activity
        this.inactivityMessageSent = false; // Track if an inactivity message was sent

        // Array of 50 different "no" responses
        this.noResponses = [
            "Srsly? Total miss.",
            "Wrng. Try hrdr.",
            "Failed agn, genius.",
            "Denied! Wake up!",
            "Not even close, amtr.",
            "Thats wrng, obv.",
            "Access denied. Agn.",
            "Nt even warm!",
            "Wow, pathetic atmpt.",
            "Nope! Swng n miss.",
            "Denied. Weak sauce.",
            "Wrng. Step it up.",
            "Nice try, failure.",
            "Incrrct, predictably.",
            "Way off. Try hrdr.",
            "Gsswrk isnt ur forte.",
            "Thats just sad.",
            "Almst? Nt rly.",
            "No entry, brainiac.",
            "Wrng key, try agn.",
            "Laughably wrng.",
            "Missed by mile.",
            "Incrrct. Agn.",
            "Blckd. Impress me.",
            "Swng n a miss.",
            "Strike 2, buddy.",
            "Not even n ballpark.",
            "That was pitiful.",
            "Pathetic gss. Agn?",
            "Ur not even close.",
            "Fail. Try agn.",
            "No, try agn, genius.",
            "Wrng. Clearly.",
            "Denied. Up ur game.",
            "Still wrng. Duh.",
            "Access fumbled.",
            "Nope. Keep gssing.",
            "Psswrd rejected.",
            "Locked out. Shockr.",
            "Thats a no-go.",
            "Gsswrk fail.",
            "Close? Nt even.",
            "U call that a try?",
            "Weak atmpt. Agn.",
            "Laughably incrrct.",
            "No joy there.",
            "Thats a no.",
            "Error! Gss agn.",
            "Try agn, rookie.",
            "Denying entry. Agn."
        ];
        
        // Track used responses
        this.usedResponses = [];
        
        // Array of 50 empty message responses
        this.emptyResponses = [
            "Well, it cant b empty!",
            "Cm on, type smthng!",
            "Blanks nt gonna cut it.",
            "Nthng there! Try typing?",
            "Need more thn silence.",
            "U forgot 2 type!",
            "Cnt process empty space.",
            "Air doesnt count, buddy.",
            "Gonna need actual txt.",
            "Invisible ink? Try agn.",
            "Void doesnt unlock doors.",
            "Zero input, zero access.",
            "Space still nuthing.",
            "Thoughts work when typed.",
            "Txt smthng, anythng!",
            "Blank? Srsly?",
            "Psswrd cant b nada.",
            "Need wrds, nt vibes.",
            "Pressing send wont cut it.",
            "Looks like u forgot smthng.",
            "No msg, no entry.",
            "U left it blank!",
            "Gotta write more thn that.",
            "Typed nuthing n pressed send?",
            "Write smthng nxt time!",
            "Entry needs sm txt.",
            "Cnt move fwd like this.",
            "Txt field is bare!",
            "Needs more thn air.",
            "Put a wrd or 3 there.",
            "Empty space wont open doors.",
            "Type b4 hitting send.",
            "Void entries dnt count.",
            "Pen ur thoughts 1st!",
            "Idea, formatted plz.",
            "Blank pages dnt flip.",
            "U sent...nuthing.",
            "Try adding chars.",
            "Empty thought, empty result.",
            "White space wont work.",
            "Lets see sm words!",
            "Silent treatment wont help.",
            "Need an actual atmpt!",
            "Stop pressing send on blank!",
            "Fill it in 1st, plz.",
            "Msg box needs content.",
            "U missed a crucial step!",
            "Guess we need words here.",
            "Silent psswrds dnt exist.",
            "Make sure 2 type, then send."
        ];
        
        // Track used empty responses
        this.usedEmptyResponses = [];
        
        // Inactivity messages
        this.inactivityMessages = [
            "You there?",
            "Hello?",
            "Hey, what's up?",
            "Still waiting...",
            "Where'd you go?",
            "Are you busy?",
            "Checking in...",
            "Did you see my message?",
            "All good?",
            "What's the holdup?",
            "Pinging again!",
            "Did you forget me?",
            "Any news?",
            "Talk to me!",
            "Can you reply?",
            "Long time, no text!",
            "Knock knock!",
            "Are you around?",
            "Give me a sign!",
            "Hello? Anyone home?"
        ];
        this.usedInactivityMessages = [];
        
        // Comeback messages for when user returns after inactivity
        this.comebackMessages = [
            "Oh, look who showed up!",
            "There u r, finally!",
            "Bout time u returned!",
            "U finally graced us!",
            "Long time, no see, superstar!",
            "U finally made an entrance!",
            "Hey, VIP!",
            "Well, well, well, look who it is!",
            "Was this a dramatic pause?",
            "Thought u vanished for good!",
            "Nice of u to drop by!",
            "Were u planning a grand reveal?",
            "Guess who's back in the game?",
            "U emerged from obscurity!",
            "Almost forgot u existed!",
            "Oh, making us wait, huh?",
            "U remembered we exist, wow!",
            "Bk n ready for action, I see!",
            "Hey, headline maker!",
            "Thought u'd left the stage!"
        ];
        this.usedComebackMessages = [];

        // Add emojis to random replies
        this.addEmojisToReplies();

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.updateModeDisplay();
        
        // Show intro sequence when page loads
        this.showIntroSequence();
    }

    addEmojisToReplies() {
        // List of emojis to add
        const emojis = [":)", ":(", ":D", ":P", ";-)", ":O", ":/", ":|", ":3", ":'(", ":*", "_", "-_-", "_<", "o_O"];
        
        // Combine both arrays to get all possible replies
        const allReplies = [...this.noResponses, ...this.emptyResponses];
        
        // Randomly select 15 indices from the combined array
        const selectedIndices = [];
        while (selectedIndices.length < 15) {
            const randomIndex = Math.floor(Math.random() * allReplies.length);
            if (!selectedIndices.includes(randomIndex)) {
                selectedIndices.push(randomIndex);
            }
        }
        
        // Add emojis to selected replies
        selectedIndices.forEach((index, emojiIndex) => {
            if (index < this.noResponses.length) {
                // It's in noResponses array
                this.noResponses[index] += " " + emojis[emojiIndex];
            } else {
                // It's in emptyResponses array
                const emptyIndex = index - this.noResponses.length;
                this.emptyResponses[emptyIndex] += " " + emojis[emojiIndex];
            }
        });
    }

    initializeElements() {
        this.textArea = document.getElementById('textArea');
        this.suggestions = document.getElementById('suggestions');
        this.keys = document.querySelectorAll('.key');
        this.fullWidthSend = document.getElementById('fullWidthSend');
        this.messagesArea = document.getElementById('messagesArea');
        this.phone = document.querySelector('.phone');
        this.colorOptions = document.querySelectorAll('.color-option');
        this.blueLine = document.querySelector('.blue-line');
    }

    bindEvents() {
        this.keys.forEach(key => {
            key.addEventListener('mousedown', (e) => this.handleKeyDown(key, e));
            key.addEventListener('mouseup', (e) => this.handleKeyUp(key, e));
            key.addEventListener('mouseleave', (e) => this.handleKeyLeave(key, e));
            key.addEventListener('touchstart', (e) => this.handleKeyDown(key, e));
            key.addEventListener('touchend', (e) => this.handleKeyUp(key, e));
        });

        this.fullWidthSend.addEventListener('mousedown', (e) => this.handleSendButton(e));
        this.fullWidthSend.addEventListener('touchstart', (e) => this.handleSendButton(e));

        // Add keyboard event listeners
        document.addEventListener('keydown', (e) => this.handleKeyboardDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyboardUp(e));
        
        // Add color picker event listeners
        this.colorOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleColorChange(e));
        });
        
        // Set default color as active and apply default color scheme
        this.colorOptions[0].classList.add('active');
        this.applyPhoneColor('default');
    }

    handleKeyDown(keyElement, event) {
        event.preventDefault();
        const key = keyElement.dataset.key;
        
        // Reset inactivity timer on any key interaction
        this.resetInactivityTimer();
        
        // Add visual feedback
        keyElement.classList.add('key-pressed');
        
        // Handle long press for key "1" only
        if (key === '1') {
            this.longPressTimer = setTimeout(() => {
                this.clearAll();
                // Remove visual feedback after clear
                keyElement.classList.remove('key-pressed');
                this.longPressTimer = null;
            }, this.longPressDuration);
        }
    }

    handleKeyUp(keyElement, event) {
        event.preventDefault();
        const key = keyElement.dataset.key;
        const letters = keyElement.dataset.letters;

        // Remove visual feedback
        keyElement.classList.remove('key-pressed');

        // Only handle input if we actually pressed down on this key
        if (key === '1') {
            // If long press timer is still running, it's a short press
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
                this.backspace(); // Short press = backspace
            }
            // If timer is null, long press already executed, do nothing
        } else {
            // For all other keys, handle normally
            this.handleRegularKeyPress(key, letters);
        }
    }

    handleKeyLeave(keyElement, event) {
        // If mouse leaves the key, cancel any pending actions
        keyElement.classList.remove('key-pressed');
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    handleRegularKeyPress(key, letters) {
        if (key === '0') {
            this.addSpace();
        } else if (key === '*') {
            this.addPunctuation();
        } else if (key === '#') {
            this.handleShiftKey();
        } else if (letters) {
            if (this.numberMode) {
                this.addNumber(key);
            } else {
                this.handleMultiTap(key);
            }
        }
    }

    handleKeyboardDown(e) {
        // Prevent key repeat from triggering multiple times
        if (e.repeat) return;
        
        const key = e.key;
        
        if (key >= '2' && key <= '9') {
            e.preventDefault();
            this.showKeyDown(key);
            if (this.numberMode) {
                this.addNumber(key);
            } else {
                this.handleMultiTap(key);
            }
        } else if (key === '1') {
            e.preventDefault();
            this.showKeyDown('1');
            
            // Start long press timer for clear all (same as UI)
            this.keyboardLongPressTimer = setTimeout(() => {
                this.clearAll();
                this.keyboardLongPressTimer = null;
            }, this.longPressDuration);
            
            this.backspace();
        } else if (key === '*') {
            e.preventDefault();
            this.showKeyDown('*');
            this.addPunctuation();
        } else if (key === '#') {
            e.preventDefault();
            this.showKeyDown('#');
            this.handleShiftKey();
        } else if (key === '0' || key === ' ') {
            e.preventDefault();
            this.showKeyDown('0');
            this.addSpace();
        } else if (key === 'Backspace') {
            e.preventDefault();
            this.showKeyDown('1'); // Backspace maps to key 1
            this.backspace();
        } else if (key === 'Enter') {
            e.preventDefault();
            // Only show visual feedback if not typing
            if (!this.isTypingActive) {
                this.showKeyDown('send'); // Show send button pressed state
                this.handleSendButton(e);
            }
        }
    }

    handleKeyboardUp(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.showKeyUp(key);
        } else if (key === '*') {
            this.showKeyUp('*');
        } else if (key === '#') {
            this.showKeyUp('#');
        } else if (key === ' ') {
            this.showKeyUp('0');
        } else if (key === 'Backspace') {
            this.showKeyUp('1'); // Backspace maps to key 1
        } else if (key === 'Enter') {
            // Only show visual feedback if not typing
            if (!this.isTypingActive) {
                this.showKeyUp('send'); // Show send button released state
            }
        }
        
        // Special handling for key "1" - cancel long press if released early
        if (key === '1' && this.keyboardLongPressTimer) {
            clearTimeout(this.keyboardLongPressTimer);
            this.keyboardLongPressTimer = null;
        }
    }

    showKeyDown(keyValue) {
        // Find the corresponding key element
        const keyElement = document.querySelector(`[data-key="${keyValue}"]`);
        if (keyElement) {
            // Add pressed state (replicates :active state)
            keyElement.classList.add('key-pressed');
        }
    }

    showKeyUp(keyValue) {
        // Find the corresponding key element
        const keyElement = document.querySelector(`[data-key="${keyValue}"]`);
        if (keyElement) {
            // Remove pressed state
            keyElement.classList.remove('key-pressed');
        }
    }

    showKeyPress(keyValue) {
        // For backwards compatibility with mouse/touch events
        this.showKeyDown(keyValue);
        setTimeout(() => {
            this.showKeyUp(keyValue);
        }, 150);
    }

    handleMultiTap(key) {
        const currentTime = Date.now();
        
        // If same key pressed within timeout, cycle to next letter
        if (this.currentKey === key && (currentTime - this.lastKeyTime) < this.timeoutDuration) {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keyMapping[key].length;
            this.currentLetter = this.keyMapping[key][this.currentKeyIndex];
        } else {
            // New key or timeout expired - commit previous letter and start new one
            if (this.currentLetter) {
                this.commitCurrentLetter();
            }
            this.currentKey = key;
            this.currentKeyIndex = 0;
            this.currentLetter = this.keyMapping[key][0];
        }
        
        this.lastKeyTime = currentTime;
        this.updateDisplay();
        
        // Set timeout to commit current letter
        clearTimeout(this.keyTimeout);
        this.keyTimeout = setTimeout(() => {
            this.commitCurrentLetter();
        }, this.timeoutDuration);
    }

    commitCurrentLetter() {
        if (this.currentLetter) {
            let letterToAdd = this.currentLetter;
            
            // Apply capitalization logic
            if (this.shiftMode || this.capsLockMode) {
                letterToAdd = letterToAdd.toUpperCase();
                // Reset shift mode after single letter (but not caps lock)
                if (this.shiftMode) {
                    this.shiftMode = false;
                    this.updateModeDisplay();
                }
            }
            
            this.currentText += letterToAdd;
            this.currentLetter = '';
            this.currentKey = null;
            this.currentKeyIndex = 0;
            this.updateDisplay();
        }
    }

    handleShiftKey() {
        const currentTime = Date.now();
        const doubleClickTime = 500; // 500ms for double-click detection
        
        // If caps lock is already on, single click turns it off
        if (this.capsLockMode) {
            this.capsLockMode = false;
            this.shiftMode = false;
        } else {
            // Check if this is a double press (enable caps lock)
            if (currentTime - this.lastHashTime < doubleClickTime) {
                this.capsLockMode = true;
                this.shiftMode = false; // Clear shift mode when enabling caps lock
            } else {
                // Single press - toggle shift mode
                this.shiftMode = !this.shiftMode;
            }
        }
        
        this.lastHashTime = currentTime;
        this.updateModeDisplay();
    }

    addSpace() {
        // Commit current letter if typing
        if (this.currentLetter) {
            this.commitCurrentLetter();
        }
        this.currentText += ' ';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentLetter) {
            // Clear current letter being typed
            this.currentLetter = '';
            this.currentKey = null;
            this.currentKeyIndex = 0;
            clearTimeout(this.keyTimeout);
        } else {
            // Delete last character from text
            this.currentText = this.currentText.slice(0, -1);
        }
        this.updateDisplay();
    }

    clearAll() {
        this.currentText = '';
        this.currentLetter = '';
        this.currentKey = null;
        this.currentKeyIndex = 0;
        this.shiftMode = false;
        this.capsLockMode = false;
        this.numberMode = false;
        this.updateDisplay();
        this.updateModeDisplay();
        clearTimeout(this.keyTimeout);
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
    }

    toggleNumberMode() {
        this.numberMode = !this.numberMode;
        // Reset shift states when switching to number mode
        if (this.numberMode) {
            this.shiftMode = false;
            this.capsLockMode = false;
        }
        this.updateModeDisplay();
        // Commit current letter if switching modes
        if (this.currentLetter) {
            this.commitCurrentLetter();
        }
    }

    addNumber(key) {
        this.currentText += key;
        this.updateDisplay();
    }

    addPunctuation() {
        const punctuation = ['.', ',', '?', '!', ';', ':', '-', '(', ')'];
        // For simplicity, just add a period. In a real T9, this would cycle through punctuation
        this.currentText += '.';
        this.updateDisplay();
    }

    updateModeDisplay() {
        const screen = document.querySelector('.screen');
        let modeIndicator = screen.querySelector('.mode-indicator');
        
        if (!modeIndicator) {
            modeIndicator = document.createElement('div');
            modeIndicator.className = 'mode-indicator';
            modeIndicator.style.cssText = `
                position: absolute;
                top: 5px;
                right: 8px;
                font-size: 9px;
                color: #1a202c;
                background: rgba(26, 32, 44, 0.1);
                padding: 1px 4px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
            `;
            screen.appendChild(modeIndicator);
        }
        
        let modeText = '';
        if (this.numberMode) {
            modeText = '123';
        } else if (this.capsLockMode) {
            modeText = 'CAPS';
        } else if (this.shiftMode) {
            modeText = 'SHIFT';
        }
        
        modeIndicator.textContent = modeText;
        modeIndicator.style.display = (this.numberMode || this.capsLockMode || this.shiftMode) ? 'block' : 'none';
    }

    updateDisplay() {
        // Update text area
        let displayText = this.currentText;
        if (this.currentLetter) {
            let displayLetter = this.currentLetter;
            // Show uppercase if shift or caps lock is active
            if (this.shiftMode || this.capsLockMode) {
                displayLetter = displayLetter.toUpperCase();
            }
            displayText += `<span style="background: rgba(0, 0, 0, 0.2); box-decoration-break: clone;">${displayLetter}</span>`;
        } else {
            // Show blinking cursor when not typing (even if text is empty)
            displayText += '<span class="cursor"></span>';
        }
        this.textArea.innerHTML = displayText;

        // Clear suggestions area for multi-tap (no suggestions needed)
        this.suggestions.innerHTML = '';


    }

    showCurrentLetter() {
        // Show current letter on the pressed key
        if (!this.currentKey) return;
        
        const keyElement = document.querySelector(`[data-key="${this.currentKey}"]`);
        if (keyElement) {
            const existingLetter = keyElement.querySelector('.current-letter');
            if (existingLetter) existingLetter.remove();

            const letterElement = document.createElement('div');
            letterElement.className = 'current-letter';
            letterElement.textContent = this.currentLetter;
            letterElement.style.cssText = `
                position: absolute;
                bottom: 3px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: #1a202c;
                background: rgba(26, 32, 44, 0.2);
                padding: 1px 4px;
                border-radius: 8px;
                font-weight: bold;
                font-family: 'Courier New', monospace;
            `;
            keyElement.appendChild(letterElement);

            setTimeout(() => {
                if (letterElement.parentNode) {
                    letterElement.remove();
                }
            }, this.timeoutDuration + 100);
        }
    }

    handleSendButton(event) {
        event.preventDefault();
        
        // Reset inactivity timer on send button interaction
        this.resetInactivityTimer();
        
        // Block sending if typing indicator is active
        if (this.isTypingActive) {
            return;
        }
        
        // Commit any current letter being typed
        if (this.currentLetter) {
            this.commitCurrentLetter();
        }
        
        // Get the current text and trim whitespace
        const currentText = this.currentText.trim();
        
        // Check if message is empty
        if (currentText === '') {
            // Don't add empty message to log, just show empty response
            setTimeout(() => {
                // Pre-fetch empty reply and measure size
                const emptyReply = this.getNextEmptyResponse();
                const { targetWidth, timestamp } = this.measureReplySize(emptyReply);
                
                // Show typing indicator with pre-calculated size
                const typingBubble = this.addTypingIndicator(targetWidth, emptyReply, timestamp);
                
                // After typing delay, replace with actual reply
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble, emptyReply, targetWidth, timestamp);
                }, 2000); // Show typing for 2 seconds
            }, 500); // Wait 500ms before responding
            return; // Exit early for empty messages
        }
        
        // Add the message to the log
        this.addMessageToLog(currentText);
        
        // Clear the phone screen
        this.currentText = '';
        this.currentLetter = '';
        this.currentKey = null;
        this.currentKeyIndex = 0;
        clearTimeout(this.keyTimeout);
        this.updateDisplay();
        
        // Check if we need to send a comeback message first
        if (this.inactivityMessageSent) {
            this.inactivityMessageSent = false; // Reset the flag
            
            // Send comeback message first
            setTimeout(() => {
                const comebackMessage = this.getNextComebackMessage();
                const { targetWidth: comebackWidth, timestamp: comebackTimestamp } = this.measureReplySize(comebackMessage);
                const comebackTypingBubble = this.addTypingIndicator(comebackWidth, comebackMessage, comebackTimestamp);
                
                setTimeout(() => {
                    this.replaceTypingWithReply(comebackTypingBubble, comebackMessage, comebackWidth, comebackTimestamp);
                    
                    // Then send the regular response after a pause
                    setTimeout(() => {
                        this.sendRegularResponse(currentText);
                    }, 1000); // Pause between comeback and regular response
                }, 1500); // Typing time for comeback message
            }, 500); // Initial delay
            
            return; // Exit early, regular response will be sent after comeback
        }
        
        // Send regular response immediately if no comeback needed
        this.sendRegularResponse(currentText);
    }

    sendRegularResponse(currentText) {
        // Check if the text matches the encoded password
        // Wait for message animation to complete (400ms) plus a small buffer
        if (this.checkPassword(currentText)) {
            setTimeout(() => {
                // Pre-fetch reply and measure size
                const replyText = 'U GOT IT.. Finally';
                const { targetWidth, timestamp } = this.measureReplySize(replyText);
                
                // Show typing indicator with pre-calculated size
                const typingBubble = this.addTypingIndicator(targetWidth, replyText, timestamp);
                
                // After typing delay, replace with actual reply
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble, replyText, targetWidth, timestamp);
                    // Open YouTube video in a new tab after 2 seconds
                    setTimeout(() => {
                        window.open('https://www.youtube.com/watch?v=7HFL8-7ulkQ', '_blank');
                    }, 2000);
                }, 2000); // Show typing for 2 seconds
            }, 500); // Wait 500ms for message animation to finish
        } else {
            setTimeout(() => {
                // Pre-fetch reply and measure size
                const replyText = this.getNextNoResponse();
                const { targetWidth, timestamp } = this.measureReplySize(replyText);
                
                // Show typing indicator with pre-calculated size
                const typingBubble = this.addTypingIndicator(targetWidth, replyText, timestamp);
                
                // After typing delay, replace with actual reply
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble, replyText, targetWidth, timestamp);
                }, 2000); // Show typing for 2 seconds
            }, 500); // Wait 500ms for message animation to finish
        }
    }

    addMessageToLog(message) {
        if (!message) return; // Don't log empty messages
        
        // Create message element
        const messageItem = document.createElement('div');
        messageItem.className = 'phone-message-item';
        
        // Create content with timestamp
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        messageItem.innerHTML = `
            <div>${message}</div>
            <div class="phone-message-timestamp">${timeStr}</div>
        `;
        
        // Add to top of messages area
        this.messagesArea.insertBefore(messageItem, this.messagesArea.firstChild);
        
        // Trigger animation
        setTimeout(() => {
            messageItem.style.opacity = '1';
            messageItem.style.transform = 'translateY(0)';
        }, 10);
        
        // Keep scroll at top (newest message)
        this.messagesArea.scrollTop = 0;
    }

    addReplyToLog(replyText) {
        // Create reply element
        const replyItem = document.createElement('div');
        replyItem.className = 'phone-reply-item';
        
        // Create content with timestamp
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        replyItem.innerHTML = `
            <div>${replyText}</div>
            <div class="phone-reply-timestamp">${timeStr}</div>
        `;
        
        // Add to top of messages area
        this.messagesArea.insertBefore(replyItem, this.messagesArea.firstChild);
        
        // Trigger animation
        setTimeout(() => {
            replyItem.style.opacity = '1';
            replyItem.style.transform = 'translateY(0)';
        }, 10);
        
        // Keep scroll at top (newest message)
        this.messagesArea.scrollTop = 0;
    }

    measureReplySize(replyText) {
        // For phone screen, we don't need complex size measurements
        // Just return simple data for typing indicator
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        return { targetWidth: 50, timestamp };
    }

    addTypingIndicator(targetWidth, replyText, timestamp) {
        // Create typing bubble for phone screen
        const typingBubble = document.createElement('div');
        typingBubble.className = 'phone-typing-bubble';
        
        // Store data for morphing
        typingBubble.dataset.replyText = replyText;
        typingBubble.dataset.timestamp = timestamp;
        
        // Create typing dots
        const typingDots = document.createElement('div');
        typingDots.className = 'phone-typing-dots';
        
        // Add three dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'phone-typing-dot';
            typingDots.appendChild(dot);
        }
        
        typingBubble.appendChild(typingDots);
        
        // Add to top of messages area
        this.messagesArea.insertBefore(typingBubble, this.messagesArea.firstChild);
        
        // Keep scroll at top
        this.messagesArea.scrollTop = 0;
        
        // Set typing active flag
        this.isTypingActive = true;
        
        return typingBubble;
    }

    replaceTypingWithReply(typingBubble, replyText, targetWidth, timestamp) {
        // Simple transition for phone screen
        setTimeout(() => {
            // Replace typing bubble with reply bubble
            const replyItem = document.createElement('div');
            replyItem.className = 'phone-reply-item';
            
            replyItem.innerHTML = `
                <div>${replyText}</div>
                <div class="phone-reply-timestamp">${timestamp}</div>
            `;
            
            // Replace the typing bubble
            typingBubble.parentNode.replaceChild(replyItem, typingBubble);
            
            // Animate appearance
            setTimeout(() => {
                replyItem.style.opacity = '1';
                replyItem.style.transform = 'translateY(0)';
            }, 10);
            
            // Keep scroll at top
            this.messagesArea.scrollTop = 0;
            
            // Clear typing active flag
            this.isTypingActive = false;
        }, 300);
    }

    getNextNoResponse() {
        // If we've used all responses, reset the used array
        if (this.usedResponses.length >= this.noResponses.length) {
            this.usedResponses = [];
        }
        
        // Find an unused response
        let availableResponses = this.noResponses.filter(response => 
            !this.usedResponses.includes(response)
        );
        
        // Pick a random response from available ones
        const randomIndex = Math.floor(Math.random() * availableResponses.length);
        const selectedResponse = availableResponses[randomIndex];
        
        // Mark it as used
        this.usedResponses.push(selectedResponse);
        
        return selectedResponse;
    }

    getNextEmptyResponse() {
        // If we've used all empty responses, reset the used array
        if (this.usedEmptyResponses.length >= this.emptyResponses.length) {
            this.usedEmptyResponses = [];
        }
        
        // Find an unused empty response
        let availableResponses = this.emptyResponses.filter(response => 
            !this.usedEmptyResponses.includes(response)
        );
        
        // Pick a random response from available ones
        const randomIndex = Math.floor(Math.random() * availableResponses.length);
        const selectedResponse = availableResponses[randomIndex];
        
        // Mark it as used
        this.usedEmptyResponses.push(selectedResponse);
        
        return selectedResponse;
    }

    showIntroSequence() {
        // Show the phone first
        const phoneContainer = document.querySelector('.phone-container');
        phoneContainer.classList.remove('hidden');
        phoneContainer.classList.add('show');
        
        // Wait a bit then start the conversation
        setTimeout(() => {
            // Message 1: "Yo"
            const message1 = "Yo";
            const { targetWidth: width1, timestamp: timestamp1 } = this.measureReplySize(message1);
            const typingBubble1 = this.addTypingIndicator(width1, message1, timestamp1);
            
            setTimeout(() => {
                this.replaceTypingWithReply(typingBubble1, message1, width1, timestamp1);
                
                // Message 2: "Bet u cant guess da psswrd" after a longer pause
                setTimeout(() => {
                    const message2 = "Bet u cant guess da psswrd";
                    const { targetWidth: width2, timestamp: timestamp2 } = this.measureReplySize(message2);
                    const typingBubble2 = this.addTypingIndicator(width2, message2, timestamp2);
                    
                    setTimeout(() => {
                        this.replaceTypingWithReply(typingBubble2, message2, width2, timestamp2);
                        
                        // Message 3: "If u can i have a gift 4 u" after another longer pause
                        setTimeout(() => {
                            const message3 = "If u can i have a gift 4 u";
                            const { targetWidth: width3, timestamp: timestamp3 } = this.measureReplySize(message3);
                            const typingBubble3 = this.addTypingIndicator(width3, message3, timestamp3);
                            
                            setTimeout(() => {
                                this.replaceTypingWithReply(typingBubble3, message3, width3, timestamp3);
                                
                                // Message 4: "Txt me your guesses" after another pause
                                setTimeout(() => {
                                    const message4 = "Txt me your guesses";
                                    const { targetWidth: width4, timestamp: timestamp4 } = this.measureReplySize(message4);
                                    const typingBubble4 = this.addTypingIndicator(width4, message4, timestamp4);
                                    
                                    setTimeout(() => {
                                        this.replaceTypingWithReply(typingBubble4, message4, width4, timestamp4);
                                        
                                        // Start inactivity timer after intro sequence
                                        setTimeout(() => {
                                            this.resetInactivityTimer();
                                        }, 2000); // Wait 2 seconds after last message
                                    }, 2000); // Typing time for message 4
                                }, 1000); // Pause before message 4
                            }, 2000); // Typing time for message 3
                        }, 1500); // Longer pause between message 2 and typing for message 3
                    }, 2000); // Typing time for message 2
                }, 1500); // Longer pause between message 1 and typing for message 2
            }, 1500); // Typing time for message 1 (shorter since it's just "Yo")
        }, 1000); // Initial delay after phone appears
    }

    handleColorChange(event) {
        const selectedColor = event.target.dataset.color;
        
        // Remove active class from all options
        this.colorOptions.forEach(option => option.classList.remove('active'));
        
        // Add active class to selected option
        event.target.classList.add('active');
        
        // Apply color to phone
        this.applyPhoneColor(selectedColor);
    }

    applyPhoneColor(colorName) {
        const colorSchemes = {
            default: {
                main: 'linear-gradient(145deg, #5a6578, #4a5568, #2d3748, #1a202c)',
                accent: 'rgba(255, 255, 255, 0.1)',
                button: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                background: '#4a8a8b',
                ambientGlow: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(124, 179, 66, 0.1) 0%, transparent 50%)'
            },
            red: {
                main: 'linear-gradient(145deg, #dc2626, #991b1b, #7f1d1d, #450a0a)',
                accent: 'rgba(255, 255, 255, 0.1)',
                button: 'linear-gradient(90deg, #dc2626, #f87171)',
                background: '#8b2635',
                ambientGlow: 'radial-gradient(circle at 25% 25%, rgba(220, 38, 38, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)'
            },
            blue: {
                main: 'linear-gradient(145deg, #2563eb, #1d4ed8, #1e40af, #1e3a8a)',
                accent: 'rgba(255, 255, 255, 0.1)',
                button: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                background: '#1e3a8a',
                ambientGlow: 'radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(96, 165, 250, 0.1) 0%, transparent 50%)'
            },
            green: {
                main: 'linear-gradient(145deg, #059669, #047857, #065f46, #064e3b)',
                accent: 'rgba(255, 255, 255, 0.1)',
                button: 'linear-gradient(90deg, #059669, #34d399)',
                background: '#065f46',
                ambientGlow: 'radial-gradient(circle at 25% 25%, rgba(5, 150, 105, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(52, 211, 153, 0.1) 0%, transparent 50%)'
            },
            yellow: {
                main: 'linear-gradient(145deg, #fbbf24, #f59e0b, #d97706, #b45309)',
                accent: 'rgba(255, 255, 255, 0.1)',
                button: 'linear-gradient(90deg, #fbbf24, #fde047)',
                background: '#d97706',
                ambientGlow: 'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(253, 224, 71, 0.1) 0%, transparent 50%)'
            }
        };

        const scheme = colorSchemes[colorName];
        if (scheme) {
            // Update phone background
            this.phone.style.background = `
                ${scheme.main},
                radial-gradient(circle at 30% 30%, ${scheme.accent} 0%, transparent 60%)
            `;
            
            // Update send button color
            if (this.blueLine) {
                this.blueLine.style.background = scheme.button;
            }
            
            // Update body background color
            document.body.style.background = scheme.background;
            
            // Update ambient glow colors
            const bodyBefore = document.body;
            bodyBefore.style.setProperty('--ambient-glow', scheme.ambientGlow);
        }
    }

    checkPassword(input) {
        // Validate user input against expected value
        const inputHash = this.simpleHash(input.toLowerCase());
        const target = 0x19A7A0; // Hex representation
        return inputHash === target;
    }

    simpleHash(str) {
        // Generate numeric representation of input
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    getNextInactivityMessage() {
        // If we've used all inactivity messages, reset the used array
        if (this.usedInactivityMessages.length >= this.inactivityMessages.length) {
            this.usedInactivityMessages = [];
        }
        
        // Find an unused inactivity message
        let availableMessages = this.inactivityMessages.filter(message => 
            !this.usedInactivityMessages.includes(message)
        );
        
        // Pick a random message from available ones
        const randomIndex = Math.floor(Math.random() * availableMessages.length);
        const selectedMessage = availableMessages[randomIndex];
        
        // Mark it as used
        this.usedInactivityMessages.push(selectedMessage);
        
        return selectedMessage;
    }

    getNextComebackMessage() {
        // If we've used all comeback messages, reset the used array
        if (this.usedComebackMessages.length >= this.comebackMessages.length) {
            this.usedComebackMessages = [];
        }
        
        // Find an unused comeback message
        let availableMessages = this.comebackMessages.filter(message => 
            !this.usedComebackMessages.includes(message)
        );
        
        // Pick a random message from available ones
        const randomIndex = Math.floor(Math.random() * availableMessages.length);
        const selectedMessage = availableMessages[randomIndex];
        
        // Mark it as used
        this.usedComebackMessages.push(selectedMessage);
        
        return selectedMessage;
    }

    resetInactivityTimer() {
        // Clear existing timer
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        // Update last activity time
        this.lastActivityTime = Date.now();
        
        // Reset inactivity message flag when user is active
        // (This happens when they interact with keys, but the comeback logic handles the send button case)
        
        // Set new timer for 1 minute (60000ms)
        this.inactivityTimer = setTimeout(() => {
            this.sendInactivityMessage();
        }, 60000);
    }

    sendInactivityMessage() {
        // Don't send if typing indicator is active
        if (this.isTypingActive) {
            this.resetInactivityTimer();
            return;
        }
        
        // Get random inactivity message
        const inactivityMessage = this.getNextInactivityMessage();
        const { targetWidth, timestamp } = this.measureReplySize(inactivityMessage);
        
        // Show typing indicator
        const typingBubble = this.addTypingIndicator(targetWidth, inactivityMessage, timestamp);
        
        // After typing delay, replace with actual message
        setTimeout(() => {
            this.replaceTypingWithReply(typingBubble, inactivityMessage, targetWidth, timestamp);
            
            // Mark that an inactivity message was sent
            this.inactivityMessageSent = true;
            
            // Reset timer for next inactivity message
            this.resetInactivityTimer();
        }, 1500); // Shorter typing time for inactivity messages
    }
}

// Initialize the Multi-Tap emulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.multiTapEmulator = new MultiTapEmulator();
    
    // Add mouse tracking for 3D phone movement
    const phone = document.querySelector('.phone');
    const phoneContainer = document.querySelector('.phone-container');
    
    let isAnimatingReflection = false;

    if (phone && phoneContainer) {
        phoneContainer.addEventListener('mouseenter', (e) => {
            // Calculate initial mouse position for smooth entry
            const rect = phoneContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);
            
            const targetRotateY = mouseX * 8;
            const targetRotateX = -mouseY * 5;
            
            // Set flag to prevent mousemove interference
            isAnimatingReflection = true;
            
            // Animate reflection from default (0,0) to current mouse position
            animateReflectionFromDefault(targetRotateX, targetRotateY, () => {
                // Re-enable mousemove updates after animation completes
                isAnimatingReflection = false;
            });
        });

        phoneContainer.addEventListener('mousemove', (e) => {
            // Don't track mouse movement if hovering over the full-width send button
            if (e.target.closest('.full-width-button')) {
                return;
            }
            
            const rect = phoneContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate mouse position relative to center (-1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);
            
            // Apply transforms based on mouse position
            const rotateY = mouseX * 8; // Max 8 degrees left/right
            const rotateX = -mouseY * 5; // Max 5 degrees up/down (inverted)
            
            // Store rotation values on the phone element
            phone.dataset.rotateX = rotateX;
            phone.dataset.rotateY = rotateY;
            
            phone.style.transform = `rotateX(${5 + rotateX}deg) rotateY(${-2 + rotateY}deg)`;
            
            // Update dynamic lighting based on rotation
            updateDynamicLighting(rotateX, rotateY);
            
            // Only update reflection if not currently animating
            if (!isAnimatingReflection) {
                updateReflectionFromRotation(rotateX, rotateY);
            }
        });
        
        phoneContainer.addEventListener('mouseleave', () => {
            // Get current rotation values
            const currentRotateX = parseFloat(phone.dataset.rotateX) || 0;
            const currentRotateY = parseFloat(phone.dataset.rotateY) || 0;
            
            // Set flag to prevent mousemove interference during exit animation
            isAnimatingReflection = true;
            
            // Set phone transition
            phone.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Return phone to default position
            phone.dataset.rotateX = 0;
            phone.dataset.rotateY = 0;
            phone.style.transform = 'rotateX(5deg) rotateY(-2deg)';
            
            // Animate reflection gradually following the phone
            animateReflectionToDefault(currentRotateX, currentRotateY);
            
            // Reset phone transition and flag after animation completes
            setTimeout(() => {
                phone.style.transition = 'transform 0.3s ease';
                isAnimatingReflection = false;
            }, 1200);
        });
    }
    
    // Reflection animation state
    let currentReflection = {
        offsetX: 0,
        offsetY: 0
    };
    let targetReflection = { ...currentReflection };
    let reflectionAnimationId = null;
    
    // Function to update reflection based on phone rotation
    function updateReflectionFromRotation(rotateX, rotateY) {
        const screen = document.querySelector('.screen');
        if (!screen) return;
        
        // Calculate target offset for all reflections to move as a group
        // Inverse relationship: phone tilts right, reflection moves left
        targetReflection.offsetX = -(rotateY * 0.2); // Max 1.6% movement left/right
        targetReflection.offsetY = -(rotateX * 0.25); // Max 1.25% movement up/down
        
        // Start smooth animation to target values
        animateReflectionToTarget();
    }
    
    // Function to smoothly animate reflection values
    function animateReflectionToTarget() {
        const screen = document.querySelector('.screen');
        if (!screen) return;
        
        // Cancel any existing animation
        if (reflectionAnimationId) {
            cancelAnimationFrame(reflectionAnimationId);
        }
        
        function animate() {
            let hasChanges = false;
            const lerpFactor = 0.12; // Slightly slower than lighting for smoother glass effect
            
            // Interpolate each reflection value towards its target
            Object.keys(currentReflection).forEach(key => {
                const current = currentReflection[key];
                const target = targetReflection[key];
                const diff = target - current;
                
                if (Math.abs(diff) > 0.01) { // Only update if difference is significant
                    currentReflection[key] = current + (diff * lerpFactor);
                    hasChanges = true;
                }
            });
            
            // Apply the smoothed values to CSS
            screen.style.setProperty('--reflection-offset-x', `${currentReflection.offsetX}%`);
            screen.style.setProperty('--reflection-offset-y', `${currentReflection.offsetY}%`);
            
            // Continue animation if values are still changing
            if (hasChanges) {
                reflectionAnimationId = requestAnimationFrame(animate);
            } else {
                reflectionAnimationId = null;
            }
        }
        
        reflectionAnimationId = requestAnimationFrame(animate);
    }
    
    // Lighting animation state
    let currentLighting = {
        topLight: 0.2,
        bottomShadow: 0.4,
        leftLight: 0.15,
        rightShadow: 0.3,
        keyTopLight: 1.0,
        keyBottomShadow: 0.15,
        keyLeftLight: 0.5,
        keyRightShadow: 0.1
    };
    let targetLighting = { ...currentLighting };
    let lightingAnimationId = null;
    
    // Function to update dynamic lighting based on phone rotation
    function updateDynamicLighting(rotateX, rotateY) {
        const phone = document.querySelector('.phone');
        if (!phone) return;
        
        // Calculate lighting adjustments based on rotation
        // When phone tilts right (positive rotateY), light should come from left side
        // When phone tilts up (negative rotateX), light should come from top
        
        // Base lighting intensities for phone
        const baseTopLight = 0.2;
        const baseBottomShadow = 0.4;
        const baseLeftLight = 0.15;
        const baseRightShadow = 0.3;
        
        // Base lighting intensities for keys and send button
        const baseKeyTopLight = 1.0;
        const baseKeyBottomShadow = 0.15;
        const baseKeyLeftLight = 0.5;
        const baseKeyRightShadow = 0.1;
        
        // Calculate dynamic adjustments (normalize rotation to 0-1 range)
        const rotateYNorm = rotateY / 8; // rotateY ranges from -8 to 8
        const rotateXNorm = rotateX / 5; // rotateX ranges from -5 to 5
        
        // Calculate target lighting values for phone with moderate dynamic range
        targetLighting.topLight = Math.max(0.13, Math.min(0.3, baseTopLight + (rotateXNorm * 0.1)));
        targetLighting.bottomShadow = Math.max(0.3, Math.min(0.5, baseBottomShadow - (rotateXNorm * 0.075)));
        targetLighting.leftLight = Math.max(0.1, Math.min(0.22, baseLeftLight - (rotateYNorm * 0.065)));
        targetLighting.rightShadow = Math.max(0.23, Math.min(0.39, baseRightShadow + (rotateYNorm * 0.065)));
        
        // Calculate target lighting values for keys and send button with more obvious highlights
        targetLighting.keyTopLight = Math.max(0.6, Math.min(1.4, baseKeyTopLight + (rotateXNorm * 0.4)));
        targetLighting.keyBottomShadow = Math.max(0.05, Math.min(0.35, baseKeyBottomShadow - (rotateXNorm * 0.15)));
        targetLighting.keyLeftLight = Math.max(0.2, Math.min(0.8, baseKeyLeftLight - (rotateYNorm * 0.3)));
        targetLighting.keyRightShadow = Math.max(0.02, Math.min(0.3, baseKeyRightShadow + (rotateYNorm * 0.15)));
        
        // Start smooth animation to target values
        animateLightingToTarget();
    }
    
    // Function to smoothly animate lighting values
    function animateLightingToTarget() {
        const phone = document.querySelector('.phone');
        if (!phone) return;
        
        // Cancel any existing animation
        if (lightingAnimationId) {
            cancelAnimationFrame(lightingAnimationId);
        }
        
        function animate() {
            let hasChanges = false;
            const lerpFactor = 0.15; // Smooth interpolation factor (lower = smoother)
            
            // Interpolate each lighting value towards its target
            Object.keys(currentLighting).forEach(key => {
                const current = currentLighting[key];
                const target = targetLighting[key];
                const diff = target - current;
                
                if (Math.abs(diff) > 0.001) { // Only update if difference is significant
                    currentLighting[key] = current + (diff * lerpFactor);
                    hasChanges = true;
                }
            });
            
            // Apply the smoothed values to CSS for phone
            phone.style.setProperty('--top-light', currentLighting.topLight);
            phone.style.setProperty('--bottom-shadow', currentLighting.bottomShadow);
            phone.style.setProperty('--left-light', currentLighting.leftLight);
            phone.style.setProperty('--right-shadow', currentLighting.rightShadow);
            
            // Apply the smoothed values to CSS for keys and send button
            const keys = document.querySelectorAll('.key');
            const sendButton = document.querySelector('.full-width-button');
            
            keys.forEach(key => {
                key.style.setProperty('--key-top-light', currentLighting.keyTopLight);
                key.style.setProperty('--key-bottom-shadow', currentLighting.keyBottomShadow);
                key.style.setProperty('--key-left-light', currentLighting.keyLeftLight);
                key.style.setProperty('--key-right-shadow', currentLighting.keyRightShadow);
            });
            
            if (sendButton) {
                sendButton.style.setProperty('--send-top-light', currentLighting.keyTopLight);
                sendButton.style.setProperty('--send-bottom-shadow', currentLighting.keyBottomShadow);
                sendButton.style.setProperty('--send-left-light', currentLighting.keyLeftLight);
                sendButton.style.setProperty('--send-right-shadow', currentLighting.keyRightShadow);
            }
            
            // Continue animation if values are still changing
            if (hasChanges) {
                lightingAnimationId = requestAnimationFrame(animate);
            } else {
                lightingAnimationId = null;
            }
        }
        
        lightingAnimationId = requestAnimationFrame(animate);
    }
    
    // Function to animate reflection gradually to default position
    function animateReflectionToDefault(startRotateX, startRotateY) {
        const duration = 1200; // 1.2 seconds to match phone animation
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use the same easing function as the phone (cubic-bezier approximation)
            const easeProgress = easeOutCubic(progress);
            
            // Interpolate rotation values from current to 0
            const currentRotateX = startRotateX * (1 - easeProgress);
            const currentRotateY = startRotateY * (1 - easeProgress);
            
            // Update reflection position and lighting based on interpolated rotation
            updateReflectionFromRotation(currentRotateX, currentRotateY);
            updateDynamicLighting(currentRotateX, currentRotateY);
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Function to animate reflection from default to target position on hover
    function animateReflectionFromDefault(targetRotateX, targetRotateY, onComplete) {
        const duration = 300; // Shorter duration for hover entry
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing for smooth entry
            const easeProgress = easeOutCubic(progress);
            
            // Interpolate rotation values from 0 to target
            const currentRotateX = targetRotateX * easeProgress;
            const currentRotateY = targetRotateY * easeProgress;
            
            // Update reflection position and lighting based on interpolated rotation
            updateReflectionFromRotation(currentRotateX, currentRotateY);
            updateDynamicLighting(currentRotateX, currentRotateY);
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                // Call completion callback
                onComplete();
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Easing function to match cubic-bezier(0.25, 0.46, 0.45, 0.94)
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add phone brand/model display
    const phone = document.querySelector('.phone');
    const brand = document.createElement('div');
    brand.innerHTML = '<div style="text-align: center; color: #cbd5e0; font-size: 11px; margin-bottom: 15px; font-family: monospace;">JOSHIA 3310</div>';
    phone.insertBefore(brand, phone.firstChild);
    
    // Add subtle animations
    const keys = document.querySelectorAll('.key');
    keys.forEach((key, index) => {
        key.style.animationDelay = `${index * 0.05}s`;
        key.style.animation = 'fadeInUp 0.5s ease forwards';
    });
});

// CSS animation for key fade-in (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

 