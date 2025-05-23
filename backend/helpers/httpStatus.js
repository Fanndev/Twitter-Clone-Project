
export const StatusCode = {
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    OK: 200,
    CREATED: 201,
  };
  
 export const ResponseMessage = {
    Loaded: "Data loaded successfully",
    Added: "Data added successfully",
    Updated: "Data updated successfully",
    Removed: "Data removed successfully",
    Restored: "Data restored successfully",
    FailLoaded: "Failed to load data",
    FailAdded: "Failed to add data",
    FailUpdated: "Failed to update data",
    FailRemoved: "Failed to remove data",
    FailRestored: "Failed to restore data",
    FailRegistered: "Failed register data",
    UserNotFound: "User not found",
    UsernameAlreadyExist: "Username already registered",
    PasswordLength: "Password must be at least 8 characters",
    EmailAlreadyExist: "Email already registered",
    Success: "Successfully",
    SuksesRegistered: "Successfully register.",
    LoginSuccess: "You have successfully logged in.",
    LoginFailed: "Invalid credentials.",
    NotFound: "Data not found",
    Unauthorized: "Unauthorized",
    Notrequired: "Email and Password not found",
    Emailnot: "Email not found",
    Wrongpass: "Wrong password",
    InvalidEmail : "Invalid email format",
    cantFollowYourself : "You can't follow yourself",
    followed : "You followed successfully",
    unfollowed : "You unfollowed successfully",
    PasswordNotMatch : "Password not same",
    PasswordRequired : "Password required",
  };
  
  export default {
    StatusCode,
    ResponseMessage,
  };
  