import express from 'express'
import { createPaste, deletePaste, getPaste, getSharePaste, updatePaste } from '../controller/paste.controller.js'
import { tokenVerify } from '../middleware/tokenVerify.js'
import { checkPrivacy, ownerAuth } from '../middleware/ownerAuth.js'
export const pasteRoute=express.Router()

pasteRoute.post('/create',tokenVerify,createPaste)
pasteRoute.delete('/delete/:pasteId',tokenVerify,ownerAuth,deletePaste)
pasteRoute.patch('/update/:pasteId',tokenVerify,ownerAuth,updatePaste)
pasteRoute.get('/get-all',tokenVerify,getPaste)
pasteRoute.get('/get-single/:pasteId',tokenVerify,checkPrivacy,getPaste)
pasteRoute.get('/:pasteId',getSharePaste)

