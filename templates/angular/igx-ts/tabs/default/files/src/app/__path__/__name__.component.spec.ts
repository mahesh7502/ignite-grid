import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { $(ClassName)Component } from './$(filePrefix).component';
import { IgxTabsModule, IgxAvatarModule, IgxCardModule, IgxButtonModule, IgxRippleModule } from 'igniteui-angular';

describe('$(ClassName)Component', () => {
  let component: $(ClassName)Component;
  let fixture: ComponentFixture<$(ClassName)Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [$(ClassName)Component],
      imports: [ IgxTabsModule, IgxAvatarModule, IgxCardModule, IgxButtonModule, IgxRippleModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent($(ClassName)Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
