import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocklyEditorComponent } from './blockly-editor.component';
import {beforeEach, describe, expect, it} from '@jest/globals';

describe('BlocklyEditorComponent', () => {
  let component: BlocklyEditorComponent;
  let fixture: ComponentFixture<BlocklyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocklyEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocklyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
