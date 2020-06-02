const responseHandler = (err, errorType, doc, docType, res) => {
  if (err && !errorType)
    return res
      .status(500)
      .json({ message: { msgBody: "An error occured.", msgError: true } });
  if (err && errorType === "userOnSave") {
    return res.status(500).json({
      message: {
        msgBody: "Error occured while saving details to DB. Try Again!",
        msgError: true,
      },
    });
  }
  if (doc && docType === "usernameTaken")
    return res.status(400).json({
      message: { msgBody: "Username already taken.", msgError: true },
    });
  if (docType === "createdAcc") {
    return res.status(201).json({
      message: {
        msgBody:
          "Account succesfully created. Please Login with the credentials.",
        msgError: false,
      },
    });
  }
};

module.exports = responseHandler;
