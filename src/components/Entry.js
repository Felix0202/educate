import {loggedIn, userData} from "@/pages/authentication";
import axios from "axios";
import {useRouter} from "next/router";

// entryCat: 0->Text, 1->Headline, 2->Card, 3->CourseTitle, 4->CourseNote

export default function Entry(ctx) {
    const router = useRouter();

    const saveEntry = (entryId) => {
        let newText = document.getElementById("inputEntry" + entryId).value;
        console.log(newText)
        axios.post('/api/saveEntry', {
            authtoken: userData.authtoken,
            userId: userData.userId,
            entryId: ctx.entryId,
            courseId: ctx.courseId,
            entryCat: ctx.entryCat,
            text: newText
        }).then((res) => {
            console.log(res.data);
            if (res.data.error) {
                router.push({
                    pathname: '/error',
                    query: {error: res.data.error}
                }, '/error');
            } else {
                document.getElementById("entrySave" + ctx.entryId).innerHTML = res.data.message;
                document.getElementById("entrySave" + ctx.entryId).classList.add("fadeOutClass");
                setTimeout(() => {
                    if (document.getElementById("entrySave" + ctx.entryId)) {
                        document.getElementById("entrySave" + ctx.entryId).style.visibility = "hidden";
                        setTimeout(() => {
                            if (document.getElementById("entrySave" + ctx.entryId)) {
                                document.getElementById("entrySave" + ctx.entryId).classList.remove("fadeOutClass");
                                document.getElementById("entrySave" + ctx.entryId).innerHTML = "SAVE";
                            }
                        }, 500)
                    }
                }, 1200);
            }
        });
    }

    if (loggedIn) {
        if (ctx.edit) {
            if (ctx.entryCat === 0) {
                return <>
                    <div className={"flexbox"}>
                        <input type={"text"} className={"courseInputHeadline"} id={"inputEntry" + ctx.entryId}
                               defaultValue={ctx.text} onClick={() => {
                            document.getElementById("entrySave" + ctx.entryId).style.visibility = "visible";
                        }}/>
                        <div className={"flexboxJustifyCenterVertical"}>
                            <button className={"buttonEntrySave"} id={"entrySave" + ctx.entryId} onClick={() => {
                                saveEntry(ctx.entryId);
                            }}>SAVE
                            </button>
                        </div>
                    </div>
                </>
            } else if (ctx.entryCat === 1) {
                return <>
                    <div className={"flexbox"}>
                        <textarea type={"text"} className={"courseInputText"} id={"inputEntry" + ctx.entryId}
                                  defaultValue={ctx.text} onClick={() => {
                            document.getElementById("entrySave" + ctx.entryId).style.visibility = "visible";
                        }}/>
                        <div className={"flexboxJustifyCenterVertical"}>
                            <button className={"buttonEntrySave"} id={"entrySave" + ctx.entryId} onClick={() => {
                                saveEntry(ctx.entryId);
                            }}>SAVE
                            </button>
                        </div>
                    </div>
                </>
            } else if (ctx.entryCat === 2) {
                return <>
                    <div className={"flexbox"}>
                        <div className={"courseEntryCardEdit"}><img className={"courseCardIMG"}
                                                                    src="../../indexCard.png"
                                                                    alt=""/><input className={"courseInputCard"}
                                                                                   type="text"
                                                                                   id={"inputEntry" + ctx.entryId}
                                                                                   defaultValue={ctx.text}
                                                                                   onClick={() => {
                                                                                       document.getElementById("entrySave" + ctx.entryId).style.visibility = "visible";
                                                                                   }}/></div>
                        <div className={"flexboxJustifyCenterVertical"}>
                            <button className={"buttonEntrySave"} id={"entrySave" + ctx.entryId} onClick={() => {
                                saveEntry(ctx.entryId);
                            }}>SAVE
                            </button>
                        </div>
                    </div>
                </>
            } else if (ctx.entryCat === 3) {
                return <>
                    <div className={"flexbox"}>
                        <input className={"courseInputTitle"}
                               type="text"
                               id={"inputEntry" + ctx.entryId}
                               defaultValue={ctx.text}
                               onClick={() => {
                                   document.getElementById("entrySave" + ctx.entryId).style.visibility = "visible";
                               }}/>
                        <div className={"flexboxJustifyCenterVertical"}>
                            <button className={"buttonEntrySave"} id={"entrySave" + ctx.entryId} onClick={() => {
                                saveEntry(ctx.entryId);
                            }}>SAVE
                            </button>
                        </div>
                    </div>
                </>
            } else if (ctx.entryCat === 4) {
                return <>
                    <div className={"flexbox courseHeaderNoteBox"}>
                        <div className={"flexboxJustifyCenterVertical heightFitContent"}>
                            <p>Note: &nbsp;</p>
                        </div>
                        <div className={"flexbox width100Box"}>
                            <div className={"flexboxJustifyCenterVertical width100Box"}>
                                <input className={"courseInputNote"}
                                       type="text"
                                       id={"inputEntry" + ctx.entryId}
                                       defaultValue={ctx.text}
                                       onClick={() => {
                                           document.getElementById("entrySave" + ctx.entryId).style.visibility = "visible";
                                       }}/>
                            </div>
                            <div className={"flexboxJustifyCenterVertical"}>
                                <button className={"buttonEntrySave"} id={"entrySave" + ctx.entryId} onClick={() => {
                                    saveEntry(ctx.entryId);
                                }}>SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }
        } else {
            if (ctx.entryCat === 0) {
                return <>
                    <div className={"courseEntryHeadline"}>{ctx.text}</div>
                </>
            } else if (ctx.entryCat === 1) {
                return <>
                    <div className={"courseEntryText"}>{ctx.text}</div>
                </>
            } else if (ctx.entryCat === 2) {
                return <>
                    <div className={"courseEntryCard"}><img className={"courseCardIMG"} src="../../indexCard.png"
                                                            alt=""/><p>{ctx.text}</p></div>
                </>
            } else if (ctx.entryCat === 3) {
                return <>
                    <h1>{ctx.text}</h1>
                </>
            } else if (ctx.entryCat === 4) {
                return <>
                    <p>Note: {ctx.text}</p>
                </>
            }
        }

    }
}