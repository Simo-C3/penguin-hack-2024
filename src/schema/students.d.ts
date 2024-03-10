export type BaseStudent = {
	name: string;
	memo: string;
};

export type Student = {
	id: number;
} & BaseStudent;

export type StudentInsert = BaseStudent;
