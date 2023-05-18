import {loggedIn} from "@/pages/authentication";

export default function Entry(ctx) {
    if (loggedIn) {
        if (ctx.edit) {

        } else {
            if (ctx.entryCat === 0) {
                return <>
                    <div class="courseEntryHeadline">{ctx.text}</div>
                </>
            } else if (ctx.entryCat === 1) {
                return <>

                    <div class="courseEntryText">{ctx.text}</div>
                </>
            } else if (ctx.entryCat === 2) {
                return <>
                    <div class="courseEntryCard"><img className="courseCardIMG" src="../../indexCard.png"
                                                      alt=""/>{ctx.text}</div>
                </>
            }
        }

    }
}