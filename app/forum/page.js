
import PostFeed from "../../components/forum/PostFeed";

export default function Forum() {


    return (
        <div>
            <h3 className="font-bold max-w-2xl mx-auto p-4 text-xl mt-2">Форум портала school journal</h3>
            <PostFeed
                isPost={true}
            />
        </div>
    );
}