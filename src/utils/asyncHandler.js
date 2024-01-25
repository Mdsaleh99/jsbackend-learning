// ye wrapper function banaya hai humne jo har jagah use karne wale hai
const asyncHandler = (requsetHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requsetHandler(req, res, next))
        .catch((error) => next(error))
    }
}



export { asyncHandler }






//     ye 3 line sirf samaj ne k liye hai. aur necche jo code hai o higher order function hai
// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => (req, res, next) => {
//     try {
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }