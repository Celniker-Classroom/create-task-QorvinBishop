// add javascript here

// useful constants
const coprime26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

document.getElementById("encryptBtn").addEventListener("click", function(){
    // user inputted key values
    let keyA = parseInt(document.getElementById("keyA").textContent);
    let keyB = parseInt(document.getElementById("keyB").textContent);
    // checks if "a" value is coprime to 26 (other restrictions are built into html)
    if (!(coprime26.includes(keyA))){
        alert("Please check key requirements");
        return;
    }
    let plaintext_string = document.getElementById("plaintext").textContent;
    let strLen = document.getElementById("plaintext").textContent.length;
    let ciphertext_string = "";
    for (let i = 0; i < strLen; i++){
        if (isAlphabetic(plaintext_string.charAt(i))){
            ciphertext_string += encryption(plaintext.charAt(i));
        }
        else{
            ciphertext_string += plaintext.charAt(i);
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
function encryptNum(num){
    let output;
    if (65 <= num && num <= 90){
        num -= 65;
        output = ((keyA * num) + keyB) % 26;
        output += 65;
    }
    else if (97 <= num && num <= 122){
        num -= 97;
        output = ((keyA * num) + keyB) % 26;
        output += 97;
    }
    return output;
}
function decryptNum(num){
    let output;
    if (65 <= num && num <= 90){
        num -= 65;
        output = ((num - keyB)/keyA) % 26;
        output += 65;
    }
    else if (97 <= num && num <= 122){
        num -= 97;
        output = ((num - keyB)/keyA) % 26;
        output += 97;
    }
    return output;
}

function encryption(char){
    let output = numToLetter(encryptNum(letterToNum(char)));
    return output;
}

function decryption(char){
    let output = numToLetter(decryptNum(letterToNum(char)));
    return output;
}