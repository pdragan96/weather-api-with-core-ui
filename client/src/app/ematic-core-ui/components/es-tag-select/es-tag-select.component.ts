import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { IEsTag } from './es-tag';
import { fadeIn } from '../../util/animations';

@Component({
  selector: 'es-tag-select',
  templateUrl: './es-tag-select.component.html',
  styleUrls: ['./es-tag-select.component.scss'],
  animations: [
    fadeIn
  ]
})
export class EsTagSelectComponent implements OnInit, OnChanges {
  @Input() hasSelectedTags: boolean;
  @Input() availableTags: any[];
  @Input() tagMapping: IEsTag;
  @Output() selectedTagsUpdated: EventEmitter<IEsTag[]> = new EventEmitter<IEsTag[]>();

  isTagSelectListOpen: boolean;
  data: IEsTag[] = [{ value: '', display: '' }];
  selectedTags: IEsTag[] = [];

  constructor() {
    this.isTagSelectListOpen = false;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.availableTags && this.availableTags.length > 0) {
      this.getTagList();
    }
    if (this.availableTags && this.hasSelectedTags) {
      this.selectTagsAtStart();
    }
  }

  isTagSelected(tag) {
    return this.selectedTags.findIndex((t: IEsTag) => t.value === tag.value) > -1;
  }

  openTagSelectList() {
    this.isTagSelectListOpen = !this.isTagSelectListOpen;
  }

  selectTagsAtStart() {
    for (const item of this.availableTags) {
      if (item.hidden) {
        const found = this.data.find((tag: IEsTag) => tag.value === item[this.tagMapping.value]);
        if (found) {
          this.onChangeTag(found);
        }
      }
    }
  }

  getTagList() {
    this.data = [];
    for (const item of this.availableTags) {
      this.data.push({ value: item[this.tagMapping.value], display: item[this.tagMapping.display] });
    }
  }

  onChangeTag(tag: IEsTag) {
    const selectedIndex: number = this.selectedTags.findIndex((selected: IEsTag) => selected.value === tag.value);
    if (selectedIndex === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(selectedIndex, 1);
    }
    this.selectedTagsUpdated.emit(this.selectedTags);
  }
}
