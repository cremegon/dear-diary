// ============================ Verify Valid Username
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

// ============================ Verify Valid Password
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

export function verifyResetPassword(pass1: string, pass2: string) {
  if (pass1 !== pass2) {
    return { error: true, message: "Passwords do not match" };
  }
  const isPasswordValid = verifyPassword(pass1);
  if (isPasswordValid.error) {
    return { error: true, message: isPasswordValid.message };
  }
  return { error: false, message: "Password Successful!" };
}
// ============================ Slice First Name from Username
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

// ============================ Login Function
export const LoginUser = async (
  email: string,
  password: string,
  setAuth: (auth: boolean) => void
) => {
  console.log(email, password);

  // ------------- Verify Username via Helper Function
  const validUsername: { error: boolean; message: string } =
    verifyUsername(email);
  if (validUsername.error) {
    return ["email", validUsername.message];
  }
  // ------------- Verify Password via Helper Function
  const validPassword: { error: boolean; message: string } =
    verifyPassword(password);
  if (validPassword.error) {
    return ["password", validPassword.message];
  }

  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await response.json();

  if (response.ok) {
    const user = localStorage.getItem("user");
    if (user) {
      const titleName = getName(data.content.name);
      const parsedUser = JSON.parse(user);
      parsedUser.isAuthenticated = true;
      parsedUser.loggedIn = true;
      parsedUser.username = titleName;
      parsedUser.profile_dp = data.content.profile_dp;
      localStorage.setItem("user", JSON.stringify(parsedUser));

      setAuth(true);
      console.log("Login Successful");
      return;
    }
  } else {
    return ["password", data.message];
  }
};

// ============================ Logout Function
export const handleLogout = async (setAuth: (auth: boolean) => void) => {
  const user = localStorage.getItem("user");
  const response = await fetch("http://localhost:5000/logout", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (response.ok) {
    if (user) {
      console.log(data.message);
      const parsedUser = JSON.parse(user);
      parsedUser.isAuthenticated = false;
      parsedUser.loggedIn = false;
      parsedUser.username = "";
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }

    setAuth(false);
  }
};

export function drawImageToCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  coverArtURL: string
) {
  const newImage = new Image();
  const canvas = canvasRef.current!;
  if (!canvas) return;
  const canvasContext = canvas.getContext("2d");

  newImage.onload = () => {
    canvas.width = newImage.width;
    canvas.height = newImage.height;
    canvasContext?.drawImage(newImage, 0, 0);
  };
  newImage.src = coverArtURL;
}

export async function testEmail() {
  const response = await fetch("http://localhost:5000/test-email", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) return "failed";
  const data = response.json();
  console.log(data);
}

export async function sendSignupCode(email: string) {
  console.log("sending sign-up code to email from frontend...", email);
  const response = await fetch(`http://localhost:5000/send-signup-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  const data = await response.json();

  return data;
}

export async function signUpCodeCheck(code: string) {
  console.log("checking signup code from frontend...", code);
  const response = await fetch(`http://localhost:5000/verify-signup-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    credentials: "include",
  });
  const data = await response.json();

  return data;
}

export async function passwordResetEmail(email: string) {
  console.log("sending email request to frontend...", email);
  const response = await fetch(`http://localhost:5000/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  const data = await response.json();

  return data;
}

export async function resetCodeCheck(code: string) {
  console.log("checking reset code from frontend...", code);
  const response = await fetch(`http://localhost:5000/check-reset-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    credentials: "include",
  });
  const data = await response.json();

  return data;
}

export async function resetPassword(password: string, forgotToken: string) {
  console.log("sending email request to frontend...", password, forgotToken);
  const response = await fetch(`http://localhost:5000/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, forgotToken }),
    credentials: "include",
  });
  const data = await response.json();

  return data;
}
