const sanitizeBody = (model: any, body: any) => {
  const allowedKeys = Object.keys(model);

  Object.keys(body).forEach((key) => {
    if (!allowedKeys.includes(key)) {
      delete body[key];
    }
  });

  return body;
};

export default sanitizeBody;
