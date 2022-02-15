import { Component, Input } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By, Meta, Title } from '@angular/platform-browser';

import { ActivatedRoute, Data } from '@angular/router';
import { Router } from 'express';
import { of } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';
import { Illustration } from '../../models/illustration.model';
import { SanityService } from '../../services/sanity.service';
import { IllustrationComponent } from './illustration.component';

const illustrationData = require('../../../test-data/illustrations.json');

@Component({
  selector: 'app-image-gallery',
  template: '<div></div>',
})
class FakeImageGalleryComponent {
  @Input() images: any;
  @Input() routerLinkBase: string;
  @Input() currentImgIndex: number;
  @Input() pagination: boolean;
  @Input() maxPagination: number;
  @Input() illustrationIds: boolean;
  @Input() illustrations: any;
}  

describe('IllustrationComponent', () => {
    let component: IllustrationComponent;
  let fixture: ComponentFixture<IllustrationComponent>;
  let mockActivatedRoute, 
      mockSanityService,
      mockTitle,
      mockMeta,
      mockDataSubscribe;
  let ILLUSTRATIONS: Illustration[];

  beforeEach(() => {
    ILLUSTRATIONS = illustrationData;

    mockActivatedRoute = {
      params: {subscribe: () => of(ILLUSTRATIONS[0]._id)},
      data: {
        illustrations: ILLUSTRATIONS,
        home: false,
        subscribe: () => {}
      },
      snapshot: {paramMap: {get(): string {return ILLUSTRATIONS[0]._id}}}
    };
    mockSanityService = jasmine.createSpyObj(
      ['getImageUrlBuilder']
    );
    mockMeta = jasmine.createSpyObj(['updateTag']);
    mockTitle = jasmine.createSpyObj(['setTitle']);
    mockDataSubscribe = jasmine.createSpyObj({
      'subscribe': () => of(true)
    })

    TestBed.configureTestingModule({
      declarations: [ 
        IllustrationComponent,
        FakeImageGalleryComponent 
      ],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: SanityService, useValue: mockSanityService},
        {provide: Meta, useValue: mockMeta},
        {provide: Title, useValue: mockTitle}
      ]
    });
    // .compileComponents();
    fixture = TestBed.createComponent(IllustrationComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should call subscribe method', () => {
    spyOn(mockActivatedRoute.data, 'subscribe').and.returnValue(of(true));

    fixture.detectChanges();

    expect(mockActivatedRoute.data.subscribe).toHaveBeenCalled();
  });

});
