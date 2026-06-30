import classNames from 'classnames'
import crosshairIcon from '../../assets/crosshair.svg?url'
import DiceIcon from './DiceIcon'

interface PilotSkillProps extends React.HTMLAttributes<HTMLDivElement> {
	skill: number
}

function PilotSkill({ skill, className, ...props }: PilotSkillProps) {
	if (!Number.isInteger(skill) || skill < 0 || skill > 6) {
		throw new Error('Invalid pilot skill. Expected an integer from 0 to 6.')
	}

	return (
		<div
			className={classNames('inline-flex items-center gap-2', className)}
			{...props}
		>
			<DiceIcon pips={skill} size={8} />
		</div>
	)
}

export default PilotSkill
