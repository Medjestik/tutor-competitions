export const GetBase64File = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
			} else {
				reject(new Error('File conversion failed'));
			}
		};

		reader.onerror = () => reject(new Error('File reading error'));
	});
};
