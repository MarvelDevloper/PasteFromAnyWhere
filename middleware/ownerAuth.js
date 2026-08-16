import { Paste } from "../model/paste.model.js";

export const ownerAuth = async(req, res,next) => {
    const userId = req.userId;
    const pasteId = req.params.pasteId

    const existPaste = await Paste.findById(pasteId)
    if(!existPaste){
        return res.status(400).json({success:false,msg:'paste with this pasteId not found'})
    }
    const Id=existPaste.userId.toString();
    console.log(Id)
    console.log(userId)

    if(Id!=userId){
        return res.status(402).json({success:false,msg:'only owner of paste allowed to perform this action!'})
    }
    next()
}

export const checkPrivacy=async(req,res,next)=>{
    const userId = req.userId;
    const pasteId = req.params.pasteId

    const existPaste = await Paste.findById(pasteId)
    if(!existPaste){
        return res.status(400).json({success:false,msg:'paste with this pasteId not found'})
    }
    const Id=existPaste.userId.toString();

    if(Id!=userId && existPaste.privacy==='private'){
        return res.status(402).json({success:false,msg:'only owner can see this private paste!'})
    }
    next()
}