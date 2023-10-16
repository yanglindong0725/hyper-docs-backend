export const passwordVerify = (password: string) => {
  const regex =
    /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;
  if (regex.test(password)) {
    return true;
  } else {
    return Promise.reject(
      'Password must be at least 6 characters long, contain at least one number, one lowercase, one uppercase letter and one special character',
    );
  }
};

export const passwordVerifyPUT = (password: string) => {
  const regex =
    /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;
  if (password === undefined) {
    return true
  }
  if (regex.test(password)) {
    return true;
  } else {
    return Promise.reject(
      'Password must be at least 6 characters long, contain at least one number, one lowercase, one uppercase letter and one special character',
    );
  }
};
