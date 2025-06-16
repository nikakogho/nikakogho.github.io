import React from 'react';
import { useParams } from 'react-router-dom';

const secrets: any = {
    "mogumogu": "Zerch 129 I love you baby, and if it's quite alright, I need you baby to warm the lonely night. I love you baby, trust in me when I say: Oh pretty baby, don't bring me down I pray. Oh pretty baby, now that I've found you stay and let me love you, oh baby let me love you. 10",
    "good": `I'm proud of you my little dumpling! Now solve this riddle for me: 
My bones are quarry-stone, my thoughts are ancient lore.
I wear a jagged crown where eagles used to soar.
My purpose was to stand against the charge and sword,
Yet now I guard but memories of a long-forgotten lord.

What am I?`,
    "castle": `I wait for you when the year exhales a sigh of gold and red,
And an ancient Roman echo of "eight" still lingers in its stead.
Seek the fulcrum of this chapter, its point of perfect poise,
The day our love finds its own balance, far from all the noise.

What is the moon and sun of the day`,
    "october-15": `Remember our walk in that kingdom of calls,
Past the giants of grass and the kings behind walls.
We found a quiet soul, a sage in its place,
With an old, knowing wisdom etched on its face.
It wasn't its size or the sound it would make,
But a single, small moment, for our memory's sake.

It simply sat there and gazed at the sun.

As if it understood, in its own silent way,
The heart of our perfect, unforgettable day.

Who was this thoughtful observer?`,
    "capybara": `Correct darling! and he will be here soon: https://share.temu.com/IExeFsbYNeA
    
    oh and btw, next secret: 
I am a vessel of liquid shadow, a paradox in fur,
I navigate my world on wires that feel the slightest stir.
My voice can be a rumbling engine, or a needle's sharpest sound,
I was once a tiny deity on consecrated ground.
I offer you my sharpest gifts, and my affection is a loan,
I am the independent king of any house I call a throne.

What am I?`,
    "cat": `That's right baby, I'm proud of my little detective <3
    This guy is coming https://share.temu.com/8XogRnrxB9A
    
    Now for a tougher riddle:
    Think of the story on an isle of stone,
Where stubborn warriors fought alone.
Their greatest foe, a scaled nightmare,
Who stole their flock and filled the air.

Until a misfit, with a gentle soul,
Mended a wing to make a rival whole.
A bond was forged, a fish was shared,
And a truth beyond the fear was bared.

Now, from that tale of newfound trust,
Find the creature born of night and dust.
The one whose name, you will agree,
Describes the smile he'd show to thee.

What is his name?`,
    "toothless": `Nicely done my love! Someone like that is headed our way https://share.temu.com/OihqQz82DOA
    
    Now one more thing: I wear a crown of broken marble, a ghost of perfect math,
Born from a contest where a branch out-valued a briny path.
My citizens were first to watch a masked and tragic face,
And a gadfly here taught men to think, then vanished without trace.
My namesake is a warrior, but my gift to all has been
The seed of thought, the stage of grief, and the rule of citizen.

What city am I?`,
    "athens": `Splendid, my treasure hunter! You have arrived somewhere interesting: https://www.wizzair.com/en-gb/itinerary/CL9JKG/koghuashvili`
};

const SecretPage: React.FC = () => {
    const { '*': secret } = useParams<{ '*': string }>();

    return (
        <div>
            <h1>A nice secret of {secret} is revealed!</h1>
            <p>
                Perhaps you were looking for a secret page? This is it!

                No actually, here is my secret:
                <br />
                {secret && secrets[secret.toLowerCase()] || "Sorry, I don't have a secret for that path."}
            </p>
        </div>
    );
};

export default SecretPage;