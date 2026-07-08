/* eslint-disable @typescript-eslint/no-explicit-any */
export const required = (errorMessage = 'Поле обязательно для заполнения') => ({
	validate: (value: string) => value.length > 0,
	errorMessage,
});

export const emailFormat = (
	errorMessage = 'Неверный формат электронной почты'
) => ({
	validate: (value: string) =>
		/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value),
	errorMessage,
});

export const phoneFormat = (
	errorMessage = 'Введите корректный мобильный номер РФ'
) => ({
	validate: (value: string) => {
		if (!value) return false;

		// Оставляем только цифры и +
		const cleaned = value.replace(/[^\d+]/g, '');

		// Проверяем количество "+"
		if ((cleaned.match(/\+/g) || []).length > 1) return false;

		// "+" только в начале
		if (cleaned.includes('+') && !cleaned.startsWith('+')) return false;

		// Убираем "+"
		const digits = cleaned.replace(/\+/g, '');

		// В РФ мобильные номера — строго 11 цифр
		if (digits.length !== 11) return false;

		// Нормализуем номер: +7, 7 или 8 — допустимо
		if (
			!(
				cleaned.startsWith('+7') ||
				cleaned.startsWith('7') ||
				cleaned.startsWith('8')
			)
		) {
			return false;
		}

		// Начало мобильных номеров РФ: 9XX
		const WITHOUT_COUNTRY = digits.replace(/^7|^8/, '');

		if (!WITHOUT_COUNTRY.startsWith('9')) return false;

		return true;
	},
	errorMessage,
});

export const linkFormat = (errorMessage = 'Введите корректную ссылку') => ({
	validate: (value: string) => {
		if (!value) return false;

		try {
			const url = new URL(value);
			return url.protocol === 'http:' || url.protocol === 'https:';
		} catch {
			return false;
		}
	},
	errorMessage,
});

export const selectRequired = (
	errorMessage = 'Необходимо выбрать значение'
) => ({
	validate: (value: unknown) => {
		if (!value) return false;

		// Если строка — запрещаем '' или '0'
		if (typeof value === 'string') return value.trim() !== '' && value !== '0';

		// Если число — запрещаем 0
		if (typeof value === 'number') return value !== 0;

		// Если объект — предполагаем наличие id или code
		if (typeof value === 'object') {
			if ('id' in value) return value.id !== 0;
			if ('code' in value) return value.code !== '0' && value.code !== 0;
		}

		return false;
	},
	errorMessage,
});

export const arrayRequired = (
	errorMessage = 'Необходимо выбрать минимум один элемент'
) => ({
	validate: (value: any[]) => Array.isArray(value) && value.length > 0,
	errorMessage,
});

export const minLength = (
	length: number,
	errorMessage = `Минимальная длина: ${length} символов`
) => ({
	validate: (value: string) => value.length >= length,
	errorMessage,
});

export const maxLength = (
	length: number,
	errorMessage = `Максимальная длина: ${length} символов`
) => ({
	validate: (value: string) => value.length <= length,
	errorMessage,
});

export const nameFormat = (
	errorMessage = 'Допустимы только буквы, цифры и стандартные символы'
) => ({
	validate: (value: string) => {
		if (!value) return false;

		const pattern =
			/^[A-Za-zА-Яа-яЁё0-9~!@#$%^&*()_+`"№;:?\-={}|'<>[\]\\,./\s]+$/;

		return pattern.test(value);
	},
	errorMessage,
});
