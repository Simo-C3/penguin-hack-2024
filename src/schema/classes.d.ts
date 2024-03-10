export type BaseClass = {
	title: string;
	test?: string;
	homework?: string;
	activityType?: string;
	activity?: string;
	comprehension?: string;
};

export type ClassInsert = BaseClass;

export type Class = {
	id: number;
	studentId: number;
	createdAt: number;
	updatedAt: number;
} & BaseClass;
