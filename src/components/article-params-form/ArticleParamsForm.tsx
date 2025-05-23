import { ArrowButton } from '../arrow-button';
import { Button } from '../button';
import { RadioGroup } from '../radio-group';
import { Select } from '../select';
import { Separator } from '../separator';
import { Text } from '../text';

import { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

import {
	ArticleStateType,
	fontFamilyOptions,
	backgroundColors,
	fontSizeOptions,
	fontColors,
	contentWidthArr,
	defaultArticleState,
} from 'src/constants/articleProps';

import { useOutsideClickClose } from '../select/hooks/useOutsideClickClose';
import { useEnterSubmit } from '../select/hooks/useEnterSubmit';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	setArticleState: (props: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setSidebarIsOpen] = useState(false);

	const [fontFamily, setFontFamily] = useState(articleState.fontFamilyOption);
	const [fontSize, setFontSize] = useState(articleState.fontSizeOption);
	const [fontColor, setFontColor] = useState(articleState.fontColor);
	const [backgroundColor, setBackgroundColor] = useState(
		articleState.backgroundColor
	);
	const [contentWidth, setContentWidth] = useState(articleState.contentWidth);

	const applyChanges = () => {
		setArticleState({
			...articleState,
			fontFamilyOption: fontFamily,
			fontSizeOption: fontSize,
			fontColor: fontColor,
			backgroundColor: backgroundColor,
			contentWidth: contentWidth,
		});
	};

	const handleReset = () => {
		setArticleState(defaultArticleState);
		setFontFamily(defaultArticleState.fontFamilyOption);
		setFontSize(defaultArticleState.fontSizeOption);
		setFontColor(defaultArticleState.fontColor);
		setBackgroundColor(defaultArticleState.backgroundColor);
		setContentWidth(defaultArticleState.contentWidth);
	};

	const ref = useRef<HTMLDivElement | null>(null);
	const enterRef = useRef<HTMLDivElement | null>(null);

	useOutsideClickClose({
		isOpen: isSidebarOpen,
		rootRef: ref,
		onClose: () => setSidebarIsOpen(false),
		onChange: () => {},
	});

	useEffect(() => {
		const handleEscKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isSidebarOpen) {
				setSidebarIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscKeyDown);

		return () => {
			document.removeEventListener('keydown', handleEscKeyDown);
		};
	}, [isSidebarOpen]);

	useEnterSubmit({
		placeholderRef: enterRef,
		onChange: applyChanges,
	});

	return (
		<div ref={ref}>
			<ArrowButton
				onClick={() => setSidebarIsOpen(!isSidebarOpen)}
				isOpen={isSidebarOpen}
			/>
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						applyChanges();
					}}
					onReset={handleReset}>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<div ref={enterRef}>
						<Select
							selected={fontFamily}
							options={fontFamilyOptions}
							title='шрифт'
							onChange={setFontFamily}
						/>
						<RadioGroup
							selected={fontSize}
							options={fontSizeOptions}
							name='fontSize'
							title='размер шрифта'
							onChange={setFontSize}
						/>
						<Select
							selected={fontColor}
							options={fontColors}
							title='цвет шрифта'
							onChange={setFontColor}
						/>
						<Separator />
						<Select
							selected={backgroundColor}
							options={backgroundColors}
							title='цвет фона'
							onChange={setBackgroundColor}
						/>
						<Select
							selected={contentWidth}
							options={contentWidthArr}
							title='ширина контента'
							onChange={setContentWidth}
						/>
					</div>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
