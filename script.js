// add javascript here

// useful constants
const coprime26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
const lowerASCII = 65;
const upperASCII = 97;
const ALPHABET_SIZE = 26

document.getElementById("encryptBtn").addEventListener("click", function(){
    // user inputted key values
    let keyA = parseInt(document.getElementById("keyA").value);
    let keyB = parseInt(document.getElementById("keyB").value);

    // checks if "a" value is coprime to 26 (other restrictions are built into html)
    if (!(coprime26.includes(keyA))){
        alert('Key "a" must be coprime to 26');
        return;
    }
    let plaintext_string = document.getElementById("plaintext").value;
    let ciphertext_string = "";
    for (let i = 0; i < plaintext_string.length; i++){
        let char = plaintext_string.charAt(i);
        // /[a-zA-Z]/ checks only english characters, while isalphabetic() checks accented letters and others
        if (/[a-zA-Z]/.test(char)){
            ciphertext_string += encryption(char, keyA, keyB);
        }
        else{
            ciphertext_string += char;
        }
    }
    document.getElementById("encryptedText").textContent = ciphertext_string;
})

document.getElementById("decryptBtn").addEventListener("click", function(){
    // code decryption stuff
    // user inputted key values
    let keyA = parseInt(document.getElementById("keyA").value);
    let keyB = parseInt(document.getElementById("keyB").value);

    // checks if "a" value is coprime to 26 (other restrictions are built into html)
    if (!(coprime26.includes(keyA))){
        alert('Key "a" must be coprime to 26');
        return;
    }
    let ciphertext_string = document.getElementById("ciphertext").value;
    let plaintext_string = "";
    for (let i = 0; i < ciphertext_string.length; i++){
        let char = ciphertext_string.charAt(i);
        // /[a-zA-Z]/ checks only english characters, while isalphabetic() checks accented letters and others
        if (/[a-zA-Z]/.test(char)){
            plaintext_string += decryption(char, keyA, keyB);
        }
        else{
            plaintext_string += char;
        }
    }
    document.getElementById("decryptedText").textContent = plaintext_string;
})

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
// fix modular inverse stuff
function decryptNum(num, a, b){
    let a_inv = MMI(a, ALPHABET_SIZE);
    if (lowerASCII <= num && num <= lowerASCII + ALPHABET_SIZE - 1){
        return (a_inv*((num - lowerASCII) - b)) % ALPHABET_SIZE + lowerASCII;
    }
    else if (upperASCII <= num && num <= upperASCII + ALPHABET_SIZE - 1){
        return (a_inv*((num - upperASCII) - b)) % ALPHABET_SIZE + upperASCII;
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