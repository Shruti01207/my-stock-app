
'use client'

const Test = () => {


    const getFormattedDate = () => {
        const d = new Date();
        const formattedDate = d.toISOString().split('T')[0];
        console.log("formattedDate", formattedDate);

    }

    return <>
        <div>
            <button onClick={getFormattedDate}>Click me</button>
        </div>
    </>
}

export default Test;