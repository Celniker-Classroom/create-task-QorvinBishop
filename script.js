// add javascript here

// useful constants
const coprime26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

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
    
})

function letterToNum(letter){
    let num = letter.charCodeAt(0);
    return num;
}

function numToLetter(num){
    let letter = String.fromCharCode(num); 
    return letter;
}
// numbers outside the function are all ASCII values
function encryptNum(num, a, b){
    let output;
    if (65 <= num && num <= 90){
        num -= 65;
        output = ((a * num) + b) % 26;
        output += 65;
    }
    else if (97 <= num && num <= 122){
        num -= 97;
        output = ((a * num) + b) % 26;
        output += 97;
    }
    return output;
}
// fix modular inverse stuff
function decryptNum(num, a, b){
    let output;
    if (65 <= num && num <= 90){
        num -= 65;
        output = ((num - b)/a) % 26;
        output += 65;
    }
    else if (97 <= num && num <= 122){
        num -= 97;
        output = ((num - b)/a) % 26;
        output += 97;
    }
    return output;
}

function encryption(char, a, b){
    let output = numToLetter(encryptNum(letterToNum(char), a, b));
    return output;
}

function decryption(char, a, b){
    let output = numToLetter(decryptNum(letterToNum(char), a, b));
    return output;
}