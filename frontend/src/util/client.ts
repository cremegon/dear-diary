export function verifyUsername(username: string) {
  const trueInclude = username.includes("@") && username.includes(".com");
  if (trueInclude) {
    const atIndex = username.indexOf("@");
    const userLength = username.slice(0, atIndex);

    if (userLength.length < 8) {
      return {
        error: true,
        message: "Email is shorter than 8 characters",
      };
    } else {
      return { error: false, message: "username verified" };
    }
  } else {
    return { error: true, message: "Invalid Email" };
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
  if (arr[0] + arr[1] >= 8 && arr[0] >= 1 && arr[2] >= 1 && arr[3] >= 1) {
    return { error: false, message: "Password Successful" };
  }
  if (arr[0] < 1) {
    return {
      error: true,
      message: "Password must contain atleast 1 uppercase character",
    };
  } else if (arr[2] < 1) {
    return {
      error: true,
      message: "Password must contain atleast 1 numeric value",
    };
  } else if (arr[3] < 1) {
    return {
      error: true,
      message: "Password must contain atleast 1 special character",
    };
  } else {
    return {
      error: true,
      message: "Please enter a valid Password of 8 characters",
    };
  }
}
export function getName(name: string) {
  let space = 0;
  for (let i = 0; i < name.length; i++) {
    if (name[i] === " ") {
      space = i;
      break;
    }
  }
  if (space > 0) {
    return name.slice(0, space);
  }
  return name;
}
