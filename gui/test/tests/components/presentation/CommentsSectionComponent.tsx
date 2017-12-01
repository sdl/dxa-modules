import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { CommentsSectionsPresentation, ICommentsSectionProps } from "@sdl/dd/CommentsSection/CommentsSectionPresentation";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";
import { TestBase } from "@sdl/models";
import { Provider } from "react-redux";
import { configureStore } from "store/Store";
import { Store } from "redux";
import { IState } from "store/interfaces/State";
import { IPostComment } from "interfaces/Comments";

class CommentsSectionComponent extends TestBase {
    public runTests(): void {
        describe(`CommentsSection component tests.`, (): void => {
            const target = super.createTargetElement();

            const defaultProps = {
                publicationId: "1",
                pageId: "1"
            };

            afterAll(() => {
                if (target.parentElement) {
                    target.parentElement.removeChild(target);
                }
            });

            it("renders component", (): void => {
                const commentsSection = this._renderComponent(defaultProps, target);
                const commentsSectionNode = ReactDOM.findDOMNode(commentsSection);
                const commentsListNode = commentsSectionNode.querySelector(".sdl-dita-delivery-comments-list");
                const postCommentNode = commentsSectionNode.querySelector(".sdl-dita-delivery-postcomment");

                expect(commentsListNode).not.toBeNull();
                expect(postCommentNode).not.toBeNull();
            });

            it("handles post save comment action", (done: () => void): void => {
                const commentsSection = this._renderComponent({
                    ...defaultProps,
                    saveComment: (service: {}, commentData: IPostComment) => {
                        expect(commentData).toBeDefined();
                        done();
                    }
                }, target);

                TestUtils.Simulate.submit(TestUtils.findRenderedDOMComponentWithTag(commentsSection, "form") as HTMLFormElement);
            });
        });
    }

    private _renderComponent(props: ICommentsSectionProps, target: HTMLElement): ComponentWithContext {
        const store: Store<IState> = configureStore();
        return ReactDOM.render(
            <ComponentWithContext>
                <Provider store={store}>
                    <CommentsSectionsPresentation {...props} />
                </Provider>
            </ComponentWithContext>,
            target
        ) as ComponentWithContext;
    }
}

new CommentsSectionComponent().runTests();
