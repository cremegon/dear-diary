export function verifyUsername(username: string) {
  const trueInclude = username.includes("@") && username.includes(".com");
  if (trueInclude) {
    const atIndex = username.indexOf("@");
    const userLength = username.slice(0, atIndex);

    if (userLength.length < 8) {
      console.log("username before @ is shorter than 8 characters");
      return false;
    }
    return true;
  } else {
    console.log("username does not include @/.com");
    return false;
  }
}

export function verifyPassword(password: string) {
  // upper,char,int,special
  const arr: number[] = [0, 0, 0, 0];
  for (const char of password) {
    const isUpper = /^[A-Z]$/.test(char);
    const isAlpha = /^[a-zA-Z]$/.test(char);
    const isDigit = /^[0-9]$/.test(char);
    const isSpecial = /^[^a-zA-Z0-9]$/.test(char);

    if (isUpper) {
      arr[0] += 1;
    } else if (isAlpha) {
      arr[1] += 1;
    } else if (isDigit) {
      arr[2] += 1;
    } else if (isSpecial) {
      arr[3] += 1;
    }
  }
  if (arr[0] + arr[1] >= 8 && arr[2] >= 1 && arr[3] >= 1) {
    console.log("Password Successful");
    return true;
  }
  return false;
}
