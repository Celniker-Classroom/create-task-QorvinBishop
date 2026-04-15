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
        setTimeout(() => {document.getElementById("encryptBtnMsg").textContent = ''}, 2000);
        return;
    }
    // checks if "b" value is integer and in range
    else if(!(0 <= keyB && keyB <= 25)){
        document.getElementById("encryptBtnMsg").textContent = 'Key "b" MUST be in range';
        setTimeout(() => {document.getElementById("encryptBtnMsg").textContent = ''}, 2000);
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
        setTimeout(() => {document.getElementById("decryptBtnMsg").textContent = ''}, 2000);
        return;
    }
    else if(!(0 <= keyB && keyB <= 25)){
        document.getElementById("decryptBtnMsg").textContent = 'Key "b" MUST be in range';
        setTimeout(() => {document.getElementById("decryptBtnMsg").textContent = ''}, 2000);
        return;
    }
    let ciphertext_string = document.getElementById("ciphertext").value;
    document.getElementById("decryptedText").textContent = charsToString(affine_transform(keyA, keyB, ciphertext_string, false));
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

function affine_transform(keyA, keyB, input_array, encrypt_mode = true){
    let output_array = [];
    for (let i = 0; i < input_array.length; i++){
        let char = input_array.charAt(i);
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