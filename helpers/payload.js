export const responsePayload = (res,statusCode, message, data) => {
    res.status(statusCode).json({
        status_code: statusCode,
        message: message,
        data : data
    })
}