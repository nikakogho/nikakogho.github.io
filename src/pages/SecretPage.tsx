import React from 'react';
import { useParams } from 'react-router-dom';

const secrets: any = {
    "mogumogu": "Zerch 129 I love you baby, and if it's quite alright, I need you baby to warm the lonely night. I love you baby, trust in me when I say: Oh pretty baby, don't bring me down I pray. Oh pretty baby, now that I've found you stay and let me love you, oh baby let me love you. 10",
};

const SecretPage: React.FC = () => {
    const { '*': notePath } = useParams<{ '*': string }>();

    return (
        <div>
            <h1>A nice secret of {notePath} is revealed!</h1>
            <p>
                Perhaps you were looking for a secret page? This is it!

                No actually, here is my secret:
                <br />
                {notePath && secrets[notePath] || "Sorry, I don't have a secret for that path."}
            </p>
        </div>
    );
};

export default SecretPage;