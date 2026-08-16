import { Paste } from "../model/paste.model.js"

export const createPaste = async (req, res) => {
    const { title, content, language, privacy } = req.body

    if (!title || !content || !language) {
        return res.status(400).json({ success: false, msg: 'all fields require' })
    }

    const paste = new Paste({ title, content, userId: req.userId, language, privacy })
    paste.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    await paste.save()

    return res.status(200).json({ success: true, msg: 'paste successfully created!' })
}

export const getPaste = async (req, res) => {
    const paste = await Paste.find({})

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const pastes = await Paste.find({})
    .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

    if (paste.length == 0) {
        return res.status(400).json({ success: false, msg: 'no paste found' })
    }
    const totalPastes = await Paste.countDocuments();

    return res.status(200).json({
        success: true,
        pastes,
        page,
        limit,
        totalPastes,
        totalPages: Math.ceil(totalPastes / limit)
    });
}

export const getSharePaste = async (req, res) => {
    const pasteId=req.params.pasteId
    const pastes = await Paste.findById({pasteId})

    if (paste.length == 0) {
        return res.status(400).json({ success: false, msg: 'no paste found' })
    }
    return res.status(200).json({success: true,paste});
}

export const getSinglePaste = async (req, res) => {
    const paste = await Paste.findById(req.params.pasteId)
    if (paste.length == 0) {
        return res.status(400).json({ success: false, msg: 'no paste found' })
    }
    return res.status(200).json({ success: true, pastes: paste })
}

export const deletePaste = async (req, res) => {
    const pasteId = req.params.pasteId;

    const deletePaste = await Paste.findByIdAndDelete(pasteId)

    if (!deletePaste) {
        return res.status(400).json({ success: false, msg: 'failed to deleted paste' })
    }
    return res.status(200).json({ success: true, msg: 'paste deleted successfully' })
}

export const updatePaste = async (req, res) => {
    const pasteId = req.params.pasteId;
    const { title, content, language, privacy } = req.body
    const updatePaste = await Paste.findByIdAndUpdate(pasteId, {
        title, content, language, privacy
    }, { return: true })

    const paste = await Paste.findById(pasteId)

    if (!paste) {
        return res.status(400).json({ success: false, msg: 'paste not found with this pasteId!' })
    }

    if (!updatePaste) {
        return res.status(400).json({ success: false, msg: 'failed to update paste' })
    }
    return res.status(200).json({ success: true, msg: 'paste updated successfully' })
}