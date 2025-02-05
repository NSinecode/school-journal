
import PostFeed from "../../components/PostFeed";

export default function Forum() {


    return (
        <>
            <h3 className="font-bold max-w-2xl mx-auto p-4 text-xl mt-2">MAKE MY FORUM GREAT AGAIN</h3>
            <PostFeed
                isPost={true}
            />
        </>
    );
}