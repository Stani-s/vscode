import { IScrollEvent } from 'vs/editor/common/editorCommon';
import { SearchView } from 'vs/workbench/contrib/search/browser/searchView';
import { ISearchQuery, ISearchViewService, ITextQuery } from 'vs/workbench/services/search/common/search';
import { Emitter, Event } from 'vs/workbench/workbench.web.main';

export class SearchViewService implements ISearchViewService {
	_serviceBrand: undefined;

	private _onDidSearchInFiles: Emitter<ISearchQuery> = new Emitter<ISearchQuery>();
	private _onDidFocus: Emitter<boolean> = new Emitter<boolean>();
	private _onDidToggleCaseSensitive: Emitter<boolean> = new Emitter<boolean>();
	private _onDidToggleWholeWords: Emitter<boolean> = new Emitter<boolean>();
	private _onDidToggleRegex: Emitter<boolean> = new Emitter<boolean>();
	private _onDidToggleSearchDetails: Emitter<boolean> = new Emitter<boolean>();

	private _onDidUpdateIncludePattern: Emitter<string> = new Emitter<string>();
	private _onDidUpdateExcludePattern: Emitter<string> = new Emitter<string>();
	private _onDidToggleOnlySearchinOpenEditors: Emitter<boolean> = new Emitter<boolean>();

	private _onDidSelectNextMatch: Emitter<void> = new Emitter<void>();
	private _onDidSelectPreviousMatch: Emitter<void> = new Emitter<void>();
	private _onDidScrollResults: Emitter<IScrollEvent> = new Emitter<IScrollEvent>();
	private _onDidToggleReplace: Emitter<boolean> = new Emitter<boolean>();
	private _onDidTogglePreserveCase: Emitter<boolean> = new Emitter<boolean>();
	private _onDidToggleReplaceAllAction: Emitter<boolean> = new Emitter<boolean>();

	// For now do only onDid, add others if it makes sense or is necessary
	readonly onDidSearchInFiles: Event<ISearchQuery> = this._onDidSearchInFiles.event;
	readonly onDidFocus: Event<boolean> = this._onDidFocus.event;
	readonly onDidToggleCaseSensitive: Event<boolean> = this._onDidToggleCaseSensitive.event;
	readonly onDidToggleWholeWords: Event<boolean> = this._onDidToggleWholeWords.event;
	readonly onDidToggleRegex: Event<boolean> = this._onDidToggleRegex.event;
	readonly onDidToggleSearchDetails: Event<boolean> = this._onDidToggleSearchDetails.event; // this is missing in the searchView, I don't know where I had seen it but this regards the files to include/exclude portion
	// Many of these events will trigger a search so I should then ignore the search event, perhaps just have an event for the textbox
	// For these 4 I would have to dig into the patternInputWidget
	readonly onDidUpdateIncludePattern: Event<string> = this._onDidUpdateIncludePattern.event;
	readonly onDidUpdateExcludePattern: Event<string> = this._onDidUpdateExcludePattern.event;
	readonly onDidToggleOnlySearchinOpenEditors: Event<boolean> = this._onDidToggleOnlySearchinOpenEditors.event;

	readonly onSelectNextMatch: Event<void> = this._onDidSelectNextMatch.event;
	readonly onSelectPreviousMatch: Event<void> = this._onDidSelectPreviousMatch.event;
	readonly onDidScrollResults: Event<IScrollEvent> = this._onDidScrollResults.event;
	readonly onDidToggleReplace: Event<boolean> = this._onDidToggleReplace.event;
	readonly onDidToglePreserveCase: Event<boolean> = this._onDidTogglePreserveCase.event;
	readonly onDidToggleReplaceAllAction: Event<boolean> = this._onDidToggleReplaceAllAction.event
	// Hooking on the listeners of the dependencies when they're registered


	constructor(private searchView: SearchView) {

	}
	// Implemented already
	getSearchResults(): Idk {

	}

	getAsyncronousSearchResults(): Idk {

	}

	focus(): void {
		this.searchView.focus();
	}

	// searchView only implements toggles and doesnt provide getters

	setCaseSensitive(value: boolean): void {
		this.search
	}

	setWholeWords(value: boolean): void {

	}

	setRegex(value: boolean): void {

	}

	setSearchDetails(value: boolean): void {

	}

	setIncludePattern(value: string): void {

	}

	setExcludePattern(value: string): void {

	}

	setOnlySearchInOpenEditors(value: boolean): void {

	}

	selectNextMatch(): void {

	}

	selectPreviousMatch(): void {

	}

	scrollResults(): void {

	}

	setReplace(value: boolean): void {

	}

	setPreserveCase(value: boolean): void {

	}

	setReplaceAllAction(value: boolean): void {

	}

	// This function won't be called for now since it would be incompatible with the current callchain
	// "Search" will be performed by changing the parameters of the searchView query
	search(query: ITextQuery, includePatternText: string, excludePatternText: string): {

	}

}
