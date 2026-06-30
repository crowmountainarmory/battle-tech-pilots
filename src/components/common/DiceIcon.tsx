import React from 'react'
import diceIcon0 from '../../assets/inverted-dice-0.svg?url'
import diceIcon1 from '../../assets/inverted-dice-1.svg?url'
import diceIcon2 from '../../assets/inverted-dice-2.svg?url'
import diceIcon3 from '../../assets/inverted-dice-3.svg?url'
import diceIcon4 from '../../assets/inverted-dice-4.svg?url'
import diceIcon5 from '../../assets/inverted-dice-5.svg?url'
import diceIcon6 from '../../assets/inverted-dice-6.svg?url'
import classNames from 'classnames';

interface DiceIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    pips: number
    size?: number
}

function Die({ pips, className, size = 8 }: DiceIconProps): React.ReactElement {
    const iconsByPips: Record<number, string> = {
        0: diceIcon0,
        1: diceIcon1,
        2: diceIcon2,
        3: diceIcon3,
        4: diceIcon4,
        5: diceIcon5,
        6: diceIcon6,
    };
    const dieSizeRem = size / 4;

    return (
        <img
            src={iconsByPips[pips]}
            alt={`Dice showing ${pips}`}
            className={classNames('inline-block align-middle', className)}
            style={{ width: `${dieSizeRem}rem`, height: `${dieSizeRem}rem` }}
        />
    );
}

function DiceIcon({className, pips, size = 8}: DiceIconProps): React.ReactElement {
    if (!Number.isInteger(pips) || pips < 0) {
        throw new Error('Invalid number of pips for a die. Must be an integer greater than or equal to 0.');
    }
    function generateDice() {
        const numberOfDice = Math.ceil(pips / 6);
        if (numberOfDice > 1) {
            const diceIcons = [];
            for (let i = 0; i < numberOfDice; i++) {
                const dicePips = Math.min(pips - (i * 6), 6);
                diceIcons.push(<Die key={i} pips={dicePips} className={className} size={size} />);
            }
            return <span>{diceIcons}</span>;
        }
        return <Die pips={pips} className={className} size={size} />;
    }
    return (
        <span>{generateDice()}</span>
    );
}

export default DiceIcon