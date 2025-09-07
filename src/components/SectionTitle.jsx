export default function SectionTitle({ text1, text2, text3 }) {
    return (
        <>
            <p className="text-center uppercase font-medium text-indigo-600 mt-28">{text1}</p>
            <h3 className="text-3xl font-semibold text-center mx-auto mt-2">{text2}</h3>
            <p className="text-sm text-slate-500 text-center mt-4 max-w-lg mx-auto">{text3}</p>
        </>
    );
}