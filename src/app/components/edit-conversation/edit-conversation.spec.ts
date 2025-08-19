import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConversation } from './edit-conversation';

describe('EditConversation', () => {
  let component: EditConversation;
  let fixture: ComponentFixture<EditConversation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConversation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConversation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
