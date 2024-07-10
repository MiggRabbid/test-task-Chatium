export type typeRatingChanged = 'up' | 'down' | 'none'

export type typeFieldName = 'model' | 'class' | 'affiliation'

export type typeInputField = typeFieldName | 'name';

export type typeGetRandomIndexes = { firstIndex: number, secondIndex: number }

export type typeCalcEloRating = { newWinRating: number, newLosRating: number }

export type typeMapRatingStyles = Record<typeRatingChanged, string>

export type typeMapFieldName = Record<typeFieldName, string>

export type typeMapInputField = Record<typeInputField, string>
