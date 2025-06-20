function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Test the hash for "shoppy"
const password = "shoppy";
const hash = simpleHash(password.toLowerCase());
console.log(`Password: "${password}"`);
console.log(`Hash (decimal): ${hash}`);
console.log(`Hash (hex): 0x${hash.toString(16).toUpperCase()}`);
console.log(`Expected: 0xCA2B8DDF`);
console.log(`Match: ${hash === 0xCA2B8DDF}`);
