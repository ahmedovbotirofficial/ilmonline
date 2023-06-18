
export function generateToken() {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let token = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
  
    return token;
  }

  export function extractNumbersFromString(inputString) {
    return inputString.replace(/\D/g, '');
  }