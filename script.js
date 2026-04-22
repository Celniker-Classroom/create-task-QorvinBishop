// add javascript here

// useful constants
const coprime26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
const lowerASCII = 97;
const upperASCII = 65;
const ALPHABET_SIZE = 26;

document.getElementById("encryptBtn").addEventListener("click", function(){
    // user inputted key values
    let keyA = Math.floor(document.getElementById("keyA").value);
    let keyB = Math.floor(document.getElementById("keyB").value);

    // checks if "a" value is coprime to 26 (other restrictions are built into html)
    if (!(coprime26.includes(keyA))){
        document.getElementById("encryptBtnMsg").textContent = 'Key "a" MUST be coprime to 26 AND in range';
        document.getElementById("encryptBtnMsg").style.color = "red";
        setTimeout(() => {document.getElementById("encryptBtnMsg").textContent = ''}, 2000);
        return;
    }
    // checks if "b" value is integer and in range
    else if(!(0 <= keyB && keyB <= 25)){
        document.getElementById("encryptBtnMsg").textContent = 'Key "b" MUST be in range'; // warning text
        document.getElementById("encryptBtnMsg").style.color = "red";
        setTimeout(() => {document.getElementById("encryptBtnMsg").textContent = ''}, 2000); // clears text after 2s
        return;
    }
    let plaintext_string = document.getElementById("plaintext").value;
    document.getElementById("encryptedText").textContent = charsToString(affine_transform(keyA, keyB, plaintext_string, true));
})

document.getElementById("decryptBtn").addEventListener("click", function(){
    // code decryption stuff
    // user inputted key values
    let keyA = Math.floor(document.getElementById("keyA").value);
    let keyB = Math.floor(document.getElementById("keyB").value);

    // checks if "a" value is coprime to 26 (other restrictions are built into html)
    if (!(coprime26.includes(keyA))){
        document.getElementById("decryptBtnMsg").textContent = 'Key "a" MUST be coprime to 26 AND in range';
        document.getElementById("decryptBtnMsg").style.color = "red";
        setTimeout(() => {document.getElementById("decryptBtnMsg").textContent = ''}, 2000);
        return;
    }
    else if(!(0 <= keyB && keyB <= 25)){
        document.getElementById("decryptBtnMsg").textContent = 'Key "b" MUST be in range';
        document.getElementById("decryptBtnMsg").style.color = "red";
        setTimeout(() => {document.getElementById("decryptBtnMsg").textContent = ''}, 2000);
        return;
    }
    let ciphertext_string = document.getElementById("ciphertext").value;
    document.getElementById("decryptedText").textContent = charsToString(affine_transform(keyA, keyB, ciphertext_string, false));
})

document.getElementById("findKeyBtn").addEventListener("click",function(){
    // clear previous keys
    document.getElementById("aKey").textContent = "a:";
    document.getElementById("bKey").textContent = "b:";
    // store known user inputs
    let knownPlaintext = document.getElementById("knownPlaintext").value;
    let knownCiphertext = document.getElementById("knownCiphertext").value;
    // [A-Za-z] tests for alphabet characters, {2} tests for length
    if (!(/^[A-Za-z]{2}$/.test(knownPlaintext)) || !(/^[A-Za-z]{2}$/.test(knownCiphertext))) {
        document.getElementById("findKeyBtnMsg").textContent = "Both inputs must be exactly 2 characters A-Z or a-z";
        document.getElementById("findKeyBtnMsg").style.color = "red";
        setTimeout(() => {document.getElementById("findKeyBtnMsg").textContent = ''}, 2000);
        return;
    }

    let p1 = letterToNumValue(knownPlaintext.charAt(0));
    let p2 = letterToNumValue(knownPlaintext.charAt(1));
    let c1 = letterToNumValue(knownCiphertext.charAt(0));
    let c2 = letterToNumValue(knownCiphertext.charAt(1));

    if (p1 === p2){
        if (c1 === c2){ // if both pairs are the same, then there are more than 1 unique solution
            document.getElementById("findKeyBtnMsg").textContent = "Warning: Multiple keys possible. Showing first valid key.";
            document.getElementById("findKeyBtnMsg").style.color = "orange";
        }
        else{ // if plaintexts pair is the same but ciphertexts are not, then impossible and no solution
            document.getElementById("findKeyBtnMsg").textContent = "Error: No valid keys possible.";
            document.getElementById("findKeyBtnMsg").style.color = "red";
            setTimeout(() => {document.getElementById("findKeyBtnMsg").textContent = ''; return;}, 2000);
        }
    }
    else{
        if (c1 === c2){ // also impossible
            document.getElementById("findKeyBtnMsg").textContent = "Error: No valid keys possible.";
            document.getElementById("findKeyBtnMsg").style.color = "red";
            setTimeout(() => {document.getElementById("findKeyBtnMsg").textContent = ''; return;}, 2000);
        }
    }

    let foundKeys = [];

    for (let a of coprime26){ // tries each possible "a" value
        // Original affine equation: y = (ax + b) mod 26
        // Solve for a b given y and x: b = (y - ax) mod 26
        let b = (c1 - (a * p1)) % ALPHABET_SIZE;
        if (b < 0) b += ALPHABET_SIZE;
        // verify key
        let expectedCipher = (a * p2 + b) % ALPHABET_SIZE;

        if (expectedCipher === c2){
            foundKeys.push({a: a, b: b}); // pushes every key that works
        }
    }
    // uses number of valid keys to conditionally display text
    if (foundKeys.length === 0){
        document.getElementById("findKeyBtnMsg").textContent = "Error: No valid key found. Make sure inputs are consistent with affine cipher.";
        document.getElementById("findKeyBtnMsg").style.color = "red";
        setTimeout(() => {document.getElementById("findKeyBtnMsg").textContent = ''; return;}, 2000);
    }
    else if (foundKeys.length === 1){
        document.getElementById("aKey").textContent = "a: " + foundKeys[0].a;
        document.getElementById("bKey").textContent = "b: " + foundKeys[0].b;
        document.getElementById("findKeyBtnMsg").textContent = "Unique Key found successfully!";
        document.getElementById("findKeyBtnMsg").style.color = "green";
        setTimeout(() => {document.getElementById("findKeyBtnMsg").textContent = ''; return;}, 2000);
    }
    else{ // not a single unique key
        document.getElementById("aKey").textContent = "a: " + foundKeys[0].a;
        document.getElementById("bKey").textContent = "b: " + foundKeys[0].b;
        document.getElementById("findKeyBtnMsg").textContent = "Warning: Multiple keys possible. Showing first valid key.";
        document.getElementById("findKeyBtnMsg").style.color = "orange";
        setTimeout(() => {document.getElementById("findKeyBtnMsg").textContent = ''; return;}, 2000);
    }
})

function letterToNumValue(letter){ // function converts letters to 0-25 values rather than ASCII
    let num = letterToNum(letter);
    if (lowerASCII <= num && num <= lowerASCII + ALPHABET_SIZE - 1){
        return num - lowerASCII;
    }
    else if (upperASCII <= num && num <= upperASCII + ALPHABET_SIZE - 1){
        return num - upperASCII;
    }
}

function letterToNum(letter){
    return letter.charCodeAt(0);
}

function numToLetter(num){
    return String.fromCharCode(num); 
}
// numbers outside the function are all ASCII values
function encryptNum(num, a, b){
    if (lowerASCII <= num && num <= lowerASCII + ALPHABET_SIZE - 1){
        return ((a * (num - lowerASCII)) + b) % ALPHABET_SIZE + lowerASCII;
    }
    else if (upperASCII <= num && num <= upperASCII + ALPHABET_SIZE - 1){
        return ((a * (num - upperASCII)) + b) % ALPHABET_SIZE + upperASCII;
    }
}

function decryptNum(num, a, b){
    let a_inv = MMI(a, ALPHABET_SIZE);
    if (lowerASCII <= num && num <= lowerASCII + ALPHABET_SIZE - 1){
        let decryptedValue = (a_inv*((num - lowerASCII) - b)) % ALPHABET_SIZE;
        if (decryptedValue < 0) decryptedValue += ALPHABET_SIZE; // js modulo can output negative so this ensures decryptedValue > 0
        return decryptedValue + lowerASCII;
    }
    else if (upperASCII <= num && num <= upperASCII + ALPHABET_SIZE - 1){
        let decryptedValue = (a_inv*((num - upperASCII) - b)) % ALPHABET_SIZE;
        if (decryptedValue < 0) decryptedValue += ALPHABET_SIZE;
        return decryptedValue + upperASCII;
    }
}

function encryption(char, a, b){
    return numToLetter(encryptNum(letterToNum(char), a, b));
}

function decryption(char, a, b){
    return numToLetter(decryptNum(letterToNum(char), a, b));
}
// Function to find Modular Multiplicative Inverse (MMI) of x mod a
function MMI(x, a){
    let x_inv = 0;
    for (let i = 0; i < a; i++) {
        // if ix is equivalent to 1 mod a, then i is the MMI of x
        if ((x * i) % a === 1) {
            x_inv = i;
            break;
        }
    }
    return x_inv;
}

function charsToString(array){
    let string = "";
    for (let i = 0; i < array.length; i++){
        string += array[i];
    }
    return string;
}

function affine_transform(keyA, keyB, input_string, encrypt_mode = true){
    let output_array = [];
    for (let i = 0; i < input_string.length; i++){
        let char = input_string.charAt(i);
        // /[a-zA-Z]/ checks only english characters, while isalphabetic() checks accented letters and others
        if (/[a-zA-Z]/.test(char)){
            if (encrypt_mode){
                output_array.push(encryption(char, keyA, keyB));
            }
            else{
                output_array.push(decryption(char, keyA, keyB));
            }
        }
        else{
            output_array.push(char);
        }
    }
    return output_array;
}