

const errorHandler=(error,req,res,next)=>{
    const statusCode=error.statusCode || 500;
    return res.status(statusCode)
    .json({
        success:false,
        message:error.message|| "Internal Server Error",
        errors:error.errors||[],
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        data: error.data || null
    })
}

export {errorHandler}